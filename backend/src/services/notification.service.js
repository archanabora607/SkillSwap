const Notification = require('../models/Notification.model');

/**
 * Creates a notification in DB and emits it via Socket.IO
 */
const createAndEmit = async (io, { recipient, type, title, body, data }) => {
  try {
    const notification = await Notification.create({ recipient, type, title, body, data });

    if (io) {
      io.to(recipient.toString()).emit('notification', {
        _id: notification._id,
        type,
        title,
        body,
        data,
        isRead: false,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

module.exports = { createAndEmit };
