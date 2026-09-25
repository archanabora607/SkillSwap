import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NotificationDropdown from './NotificationDropdown';
import Logo from './Logo';
import {
  Compass,
  Repeat,
  MessageSquare,
  Calendar,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadMessagesCount } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Exchanges', path: '/exchanges', icon: Repeat },
    { label: 'Chat', path: '/chat', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Sessions', path: '/sessions', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#5B2333] border-b border-[#7A2E44] shadow-[0_8px_25px_rgba(91,35,51,0.25)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <Logo size="md" textColor="white" />
          </Link>

          {/* Navigation Links for Authenticated Users */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 ${
                      active
                        ? 'bg-[#FFF8F3]/15 text-[#FFF8F3] border border-[#F4B6A6]/40 shadow-xs'
                        : 'text-[#F4B6A6]/80 hover:text-white hover:bg-[#FFF8F3]/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#F4B6A6]' : 'text-[#F4B6A6]/70'}`} />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-[#C86B7B] text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Right Menu / Auth Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />

                {/* Profile Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#FFF8F3]/10 transition-all focus:outline-none cursor-pointer"
                  >
                    <div className="relative">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover border-2 border-[#F4B6A6]/40"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C86B7B] to-[#F4B6A6] flex items-center justify-center text-[#5B2333] font-black text-sm shadow-md">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#5B2333]"></span>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-extrabold text-[#FFF8F3]">{user?.name}</p>
                      <p className="text-[10px] text-[#F4B6A6]/80">{user?.major || 'Student'}</p>
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-[#F2E5DC] z-50 py-2 animate-in fade-in duration-150">
                      <div className="px-4 py-2.5 border-b border-[#F2E5DC] bg-[#FFF8F3]">
                        <p className="text-xs font-bold text-[#5B2333] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#665550] truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-[#29201D] hover:bg-[#FFF8F3] hover:text-[#5B2333] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#C86B7B]" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-[#F4B6A6] hover:text-white hover:bg-[#FFF8F3]/10"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-[#FFF8F3] hover:text-[#F4B6A6] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-extrabold text-[#5B2333] px-4 py-2 rounded-xl bg-[#F4B6A6] hover:bg-[#FFF8F3] shadow-md shadow-[#5B2333]/30 transition-all active:translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav Links */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#7A2E44] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                    isActive(item.path)
                      ? 'bg-[#FFF8F3]/20 text-white font-extrabold'
                      : 'text-[#F4B6A6]/80 hover:text-white hover:bg-[#FFF8F3]/10'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#F4B6A6]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
