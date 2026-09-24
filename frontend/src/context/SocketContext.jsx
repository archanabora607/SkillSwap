import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io('/', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('⚡ Connected to Socket.io server');
    });

    newSocket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('newNotification', (notification) => {
      setUnreadNotificationsCount((prev) => prev + 1);
      toast((t) => (
        <div className="flex items-center space-x-3">
          <div className="text-xl">🔔</div>
          <div>
            <p className="font-semibold text-sm text-gray-100">{notification.title}</p>
            <p className="text-xs text-gray-400">{notification.message}</p>
          </div>
        </div>
      ), { duration: 4000 });
    });

    newSocket.on('newMessage', (data) => {
      setUnreadMessagesCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        unreadMessagesCount,
        setUnreadMessagesCount,
        isUserOnline: (userId) => onlineUsers.includes(userId?.toString()),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
