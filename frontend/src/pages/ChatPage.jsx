import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../services/api';
import SessionModal from '../components/SessionModal';
import { MessageSquare, Send, Calendar, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [activeExchange, setActiveExchange] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch Conversations List
  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await API.get('/chat/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (res.data.conversations.length > 0 && !activeConversation) {
          setActiveConversation(res.data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch Messages when activeConversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await API.get(`/chat/messages/${activeConversation._id}`);
        if (res.data.success) {
          setMessages(res.data.messages);
          scrollToBottom();
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Mark messages read on socket
    if (socket) {
      socket.emit('markRead', { conversationId: activeConversation._id });
    }
  }, [activeConversation?._id, socket]);

  // Socket Events Listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, conversationId }) => {
      if (activeConversation && activeConversation._id === conversationId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
        socket.emit('markRead', { conversationId });
      }

      // Update last message in conversations list
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? { ...c, lastMessage: message.content, updatedAt: new Date().toISOString() }
            : c
        )
      );
    };

    const handleTypingStatus = ({ userId, isTyping: typingStatus }) => {
      const partner = activeConversation?.participants?.find((p) => p._id !== user._id);
      if (partner && partner._id === userId) {
        setIsTyping(typingStatus);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('typingStatus', handleTypingStatus);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('typingStatus', handleTypingStatus);
    };
  }, [socket, activeConversation, user._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Typing Emit
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    if (!socket || !activeConversation) return;

    socket.emit('typing', { conversationId: activeConversation._id, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId: activeConversation._id });
    }, 2000);
  };

  // Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !activeConversation) return;

    const partner = activeConversation.participants.find((p) => p._id !== user._id);

    socket.emit('sendMessage', {
      receiverId: partner._id,
      content: messageInput.trim(),
    });

    setMessageInput('');
    socket.emit('stopTyping', { conversationId: activeConversation._id });
  };

  // Open Schedule Session modal by fetching active exchange between users
  const handleOpenScheduleSession = async () => {
    const partner = activeConversation?.participants?.find((p) => p._id !== user._id);
    if (!partner) return;

    try {
      const res = await API.get('/exchanges');
      if (res.data.success) {
        const found = res.data.exchanges.find(
          (e) =>
            e.status === 'Accepted' &&
            ((e.requester._id === user._id && e.receiver._id === partner._id) ||
              (e.receiver._id === user._id && e.requester._id === partner._id))
        );

        if (found) {
          setActiveExchange(found);
          setSessionModalOpen(true);
        } else {
          toast.error('You need an active skill swap request to schedule a session.');
        }
      }
    } catch (err) {
      toast.error('Failed to open schedule session modal.');
    }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find((p) => p._id !== user._id) || {};
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#FFF8F3]">
      <div className="knowvia-card-3d rounded-3xl border border-[#E8D8CC] overflow-hidden h-[78vh] flex flex-col md:flex-row shadow-2xl">
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#F2E5DC] flex flex-col bg-[#FFFBF8]">
          <div className="p-4 border-b border-[#F2E5DC] bg-[#5B2333] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#F4B6A6]" />
              <h2 className="font-black text-sm font-['Outfit']">Messages</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#F2E5DC]">
            {loadingConversations ? (
              <div className="p-6 text-center text-xs text-[#8C7770]">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#8C7770] font-medium">
                No active chat conversations yet. Accept an exchange request to start chatting!
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = getOtherParticipant(conv);
                const isOnline = isUserOnline(partner._id);
                const isActive = activeConversation?._id === conv._id;

                return (
                  <div
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                      isActive ? 'bg-[#FFF8F3] border-l-4 border-[#C86B7B]' : 'hover:bg-[#FFF8F3]/60'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {partner.avatar ? (
                        <img
                          src={partner.avatar}
                          alt={partner.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#F4B6A6]/40"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#5B2333] flex items-center justify-center text-white font-black text-sm">
                          {partner.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#29201D] truncate">{partner.name}</p>
                        {isOnline && (
                          <span className="text-[10px] text-emerald-600 font-extrabold">Online</span>
                        )}
                      </div>
                      <p className="text-xs text-[#665550] truncate mt-0.5">
                        {conv.lastMessage || 'Click to start chatting'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Chat Room */}
        <div className="flex-1 flex flex-col bg-[#FFF8F3]">
          {activeConversation ? (
            <>
              {/* Active Header */}
              <div className="p-4 border-b border-[#F2E5DC] flex items-center justify-between bg-white shadow-xs">
                <div className="flex items-center space-x-3">
                  {getOtherParticipant(activeConversation).avatar ? (
                    <img
                      src={getOtherParticipant(activeConversation).avatar}
                      alt={getOtherParticipant(activeConversation).name}
                      className="w-9 h-9 rounded-xl object-cover border border-[#F4B6A6]/40"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-[#5B2333] flex items-center justify-center font-black text-white text-sm">
                      {getOtherParticipant(activeConversation).name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-[#29201D] text-sm font-['Outfit']">
                      {getOtherParticipant(activeConversation).name}
                    </h3>
                    <p className="text-[10px] text-[#665550] font-semibold">
                      {isUserOnline(getOtherParticipant(activeConversation).id)
                        ? '🟢 Online'
                        : 'Offline'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenScheduleSession}
                  className="knowvia-btn-rose px-3.5 py-1.5 text-xs font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Session</span>
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {loadingMessages ? (
                  <div className="text-center text-xs text-[#8C7770] py-6">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-[#8C7770] py-12 font-medium">
                    No messages yet. Send a greeting to introduce yourself!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender._id === user._id || msg.sender === user._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs space-y-1 font-medium ${
                            isMe
                              ? 'bg-[#C86B7B] text-white rounded-br-none shadow-md'
                              : 'bg-white text-[#29201D] rounded-bl-none border border-[#F2E5DC] shadow-xs'
                          }`}
                        >
                          <p className="leading-relaxed">{msg.content}</p>
                          <div
                            className={`flex items-center justify-end space-x-1 text-[9px] ${
                              isMe ? 'text-[#FFF8F3]/90' : 'text-[#8C7770]'
                            }`}
                          >
                            <span>{format(new Date(msg.createdAt), 'p')}</span>
                            {isMe &&
                              (msg.isRead ? (
                                <CheckCheck className="w-3 h-3 text-[#FFF8F3]" />
                              ) : (
                                <Check className="w-3 h-3 opacity-70" />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-[#5B2333] border border-[#F2E5DC] px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 italic animate-pulse font-semibold">
                      <span>typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#F2E5DC] bg-white flex items-center space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl glass-input font-medium"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2.5 rounded-xl knowvia-btn-rose text-white disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#8C7770]">
              <MessageSquare className="w-12 h-12 mb-3 text-[#C86B7B]" />
              <p className="text-sm font-bold text-[#29201D]">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {activeExchange && (
        <SessionModal
          exchange={activeExchange}
          isOpen={sessionModalOpen}
          onClose={() => setSessionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
