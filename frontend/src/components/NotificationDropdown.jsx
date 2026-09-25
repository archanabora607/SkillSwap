import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useSocket } from '../context/SocketContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { unreadNotificationsCount, setUnreadNotificationsCount } = useSocket();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notifications');
      if (res.data.success) {
        const notifs = res.data.data?.notifications || res.data.notifications || [];
        setNotifications(notifs);
        const unread = notifs.filter((n) => !n.isRead).length;
        setUnreadNotificationsCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotificationsCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (item) => {
    handleMarkRead(item._id);
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative p-2 rounded-xl text-[#F4B6A6]/90 hover:text-white hover:bg-[#FFF8F3]/10 transition-colors focus:outline-none cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C86B7B] text-[10px] font-black text-white shadow-md">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#F2E5DC] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[#F2E5DC] bg-[#FFF8F3] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-[#5B2333] font-['Outfit']">Notifications</h3>
              {unreadNotificationsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#5B2333]/10 text-[#5B2333] font-bold">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#C86B7B] hover:text-[#5B2333] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#F2E5DC]">
            {loading ? (
              <div className="p-6 text-center text-sm text-[#8C7770]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#8C7770] font-medium">
                No notifications yet
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-4 hover:bg-[#FFF8F3] cursor-pointer transition-colors flex items-start space-x-3 ${
                    !item.isRead ? 'bg-[#FFF8F3]/60' : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      !item.isRead ? 'bg-[#5B2333]/10 text-[#5B2333]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#29201D] truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#665550] mt-0.5 line-clamp-2 font-medium">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-[#8C7770] mt-1 block">
                      {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#C86B7B] mt-1.5 flex-shrink-0"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
