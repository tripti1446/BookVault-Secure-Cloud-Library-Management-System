import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, LogOut, Settings, User, CheckCircle2, ShieldCheck, Mail, Globe } from 'lucide-react';
import { LibraryNotification } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onViewChange: (view: string) => void;
  notifications: LibraryNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  toggleSidebar: () => void;
  searchTerm: string;
  operatorEmail?: string;
}

export default function Header({
  onSearch,
  onViewChange,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  toggleSidebar,
  searchTerm,
  operatorEmail = 'sarah.jenkins@bookvault.org'
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getOperatorDetails = () => {
    switch(operatorEmail.toLowerCase().trim()) {
      case 'james.carter@bookvault.org':
        return {
          name: 'James Carter',
          role: 'Circulation Desk Staff',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop font&q=50&w=120',
          clearance: 'Circ Desk'
        };
      case 'elena.r@bookvault.org':
        return {
          name: 'Elena Rostova',
          role: 'Database Associate',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=50&w=120',
          clearance: 'DB Admin'
        };
      case 'sarah.jenkins@bookvault.org':
      default:
        return {
          name: 'Sarah Jenkins',
          role: 'Head Librarian',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=50&w=120',
          clearance: 'Super Admin'
        };
    }
  };

  const operator = getOperatorDetails();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm" id="main-header">
      {/* Left section: Toggle Menu & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer block"
          title="Toggle Navigation Menu"
          id="global-sidebar-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full group" id="global-search-container">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search books, members, transactions, ISBNs, IDs..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            id="global-search-input"
          />
        </div>
      </div>

      {/* Right section: System Badge, Notification Bell & Admin Profile */}
      <div className="flex items-center gap-4">
        {/* Environment Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notificationRef} id="notifications-bell-wrapper">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-all relative cursor-pointer ${
              showNotifications ? 'bg-slate-100 text-slate-800' : ''
            }`}
            title="System alerts and pending requests"
            id="notifications-bell"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden transform origin-top-right transition-all">
              <div className="px-4 py-3 bg-[#0B1B3D] text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">System Notifications</h4>
                  <p className="text-[10px] text-slate-300 font-medium">{unreadCount} unread notices</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onClearAllNotifications();
                      setShowNotifications(false);
                    }}
                    className="text-xs text-indigo-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted decoration-1 underline-offset-4 font-semibold"
                    id="mark-all-read-btn"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-slate-300" />
                    <span>No unread notifications</span>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                        !notif.read ? 'bg-blue-50/40 border-l-2 border-blue-500' : ''
                      }`}
                      id={`notif-item-${notif.id}`}
                    >
                      <div className="flex justify-between items-start mb-1 overflow-hidden">
                        <span className={`font-semibold capitalize px-1.5 py-0.5 rounded text-[9px] ${
                          notif.type === 'alert' ? 'bg-red-50 text-red-600 border border-red-100' :
                          notif.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          notif.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {notif.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 mb-0.5">{notif.title}</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => {
                    onViewChange('notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors cursor-pointer"
                  id="view-all-notifs-btn"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef} id="admin-profile-wrapper">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 hover:bg-slate-100 p-1.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
            id="admin-profile-dropdown-btn"
          >
            <div className="relative">
              <img
                src={operator.avatar}
                alt="Admin Avatar"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/20"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-[-1px] right-[-1px] h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-left hidden lg:block">
              <span className="block text-xs font-bold text-slate-800">{operator.name}</span>
              <span className="block text-[10px] text-slate-400 font-medium">{operator.role}</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden transform origin-top-right transition-all">
              {/* Profile Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-semibold mb-1">Signed In As</p>
                <p className="text-sm font-bold text-slate-800">{operatorEmail}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-md uppercase">
                  {operator.clearance}
                </span>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => {
                    onViewChange('settings');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  id="profile-menu-settings"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Library Admin Config</span>
                </button>
                <button
                  onClick={() => {
                    onViewChange('backup');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  id="profile-menu-backup"
                >
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Cloud Replication</span>
                </button>
              </div>
              <div className="p-2 border-t border-slate-100 bg-rose-50/30">
                <button
                  onClick={() => {
                    onViewChange('logout');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  id="profile-menu-logout"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Terminate Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
