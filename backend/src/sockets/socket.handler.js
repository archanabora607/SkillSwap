const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Message = require('../models/Message.model');
const Conversation = require('../models/Conversation.model');

const setupSocket = (io) => {
  // Middleware: authenticate socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: No token'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('Authentication error: User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🔌 User connected: ${socket.user.name} (${userId})`);

    // Join personal room for notifications
    socket.join(userId);

    // Mark user online
    await User.findByIdAndUpdate(userId, { isOnline: true });
    socket.broadcast.emit('user_online', { userId });

    // ── Join conversation room ────────────────────────────────────────
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    // ── Send message ──────────────────────────────────────────────────
    socket.on('send_message', async ({ conversationId, content }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant = conversation.participants.some((p) => p.toString() === userId);
        if (!isParticipant) return;

        // Save message to DB
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content: content.trim(),
          readBy: [userId],
        });

        await message.populate('sender', 'name');

        // Update conversation last message + unread counts
        conversation.lastMessage = message._id;
        conversation.participants.forEach((participantId) => {
          if (participantId.toString() !== userId) {
            const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
            conversation.unreadCount.set(participantId.toString(), currentCount + 1);
          }
        });
        await conversation.save();

        // Emit to all in conversation room
        io.to(conversationId).emit('new_message', message);
      } catch (err) {
        console.error('Send message error:', err.message);
      }
    });

    // ── Typing indicators ─────────────────────────────────────────────
    socket.on('typing_start', ({ conversationId }) => {
      socket.to(conversationId).emit('typing', { userId, isTyping: true });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(conversationId).emit('typing', { userId, isTyping: false });
    });

    // ── Mark messages as read ─────────────────────────────────────────
    socket.on('message_read', async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );

        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.unreadCount.set(userId, 0);
          await conversation.save();
        }

        socket.to(conversationId).emit('messages_read', { conversationId, readBy: userId });
      } catch (err) {
        console.error('Mark read error:', err.message);
      }
    });

    // ── Disconnect ────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`🔴 User disconnected: ${socket.user.name}`);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      socket.broadcast.emit('user_offline', { userId, lastSeen: new Date() });
    });
  });
};

module.exports = { setupSocket };
