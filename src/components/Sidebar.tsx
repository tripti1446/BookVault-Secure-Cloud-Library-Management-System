import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowUpDown,
  CalendarCheck,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  Database,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookMarked
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  unreadNotificationsCount: number;
}

export default function Sidebar({
  currentView,
  onViewChange,
  collapsed,
  setCollapsed,
  unreadNotificationsCount
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'issue-return', label: 'Issue / Return', icon: ArrowUpDown },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
    { id: 'fines', label: 'Fines', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <aside
      className={`bg-[#0B1B3D] text-slate-100 transition-all duration-300 flex flex-col h-screen sticky top-0 border-r border-[#152e61] shadow-2xl z-20 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
      id="sidebar-container"
    >
      {/* Brand Logo Section */}
      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0 text-white shadow-lg shadow-blue-500/20">
            <BookMarked className="w-6 h-6 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="transition-opacity duration-200">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                BookVault
              </span>
              <p className="text-[10px] text-indigo-400 font-medium tracking-wide whitespace-nowrap">
                Secure Cloud Library
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-indigo-300 hover:text-white transition-colors cursor-pointer hidden lg:block"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          id="sidebar-toggle-btn"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Items Group */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-blue-600/30 text-white border-l-4 border-blue-400 font-semibold shadow-inner'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 border-l-4 border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
              id={`sidebar-link-${item.id}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap truncate">{item.label}</span>
              )}

              {/* Badges / Counters */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`flex items-center justify-center text-[10px] font-bold rounded-full ${
                  collapsed 
                    ? 'absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white' 
                    : 'px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Floating Tooltip during collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-md border border-slate-700/50 z-50">
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Admin Badge */}
      <div className="p-4 border-t border-slate-800/50 bg-[#07132e] flex flex-col gap-2">
        {!collapsed && (
          <div className="px-3 py-2 bg-slate-900/40 rounded-xl border border-slate-800/50 flex items-center gap-3 mb-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">System Environment</p>
              <p className="text-[10px] text-emerald-400 font-mono tracking-wider">SECURE AWS ACTIVE</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => onViewChange('logout')}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer group relative"
          title={collapsed ? 'Log Out' : undefined}
          id="sidebar-logout-btn"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-rose-300 group-hover:-translate-x-0.5 transition-transform duration-200" />
          {!collapsed && <span className="text-left font-medium">Log Out</span>}
          
          {collapsed && (
            <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-md border border-slate-700/50 z-50">
              Log Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
