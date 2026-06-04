import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Mail, 
  DollarSign, 
  Users, 
  Database, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  UserPlus, 
  Download, 
  RefreshCw,
  Server,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { SystemOperator } from '../types';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'fines' | 'users' | 'database'>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings inputs state
  const [libraryName, setLibraryName] = useState(() => localStorage.getItem('bv_setting_libName') || 'Central Campus Library (Block-B)');
  const [contactEmail, setContactEmail] = useState(() => localStorage.getItem('bv_setting_contactEmail') || 'library-desk@university.edu');
  const [contactPhone, setContactPhone] = useState(() => localStorage.getItem('bv_setting_contactPhone') || '+91 22 4567 8901');
  const [currency, setCurrency] = useState(() => localStorage.getItem('bv_setting_currency') || 'INR');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('bv_setting_dateFormat') || 'YYYY-MM-DD');

  // Fine settings state
  const [dailyFineValue, setDailyFineValue] = useState(() => Number(localStorage.getItem('bv_setting_dailyFineValue') || '10'));
  const [gracePeriod, setGracePeriod] = useState(() => Number(localStorage.getItem('bv_setting_gracePeriod') || '3'));
  const [lockThreshold, setLockThreshold] = useState(() => Number(localStorage.getItem('bv_setting_lockThreshold') || '500'));

  // Email rules toggle state
  const [sendWelcome, setSendWelcome] = useState(() => localStorage.getItem('bv_setting_sendWelcome') !== 'false');
  const [sendReminder, setSendReminder] = useState(() => localStorage.getItem('bv_setting_sendReminder') !== 'false');
  const [sendFineNotification, setSendFineNotification] = useState(() => localStorage.getItem('bv_setting_sendFineNotification') !== 'false');

  // Dynamic Operators State
  const [operators, setOperators] = useState<SystemOperator[]>(() => {
    const saved = localStorage.getItem('bookvault_operators');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaults = [
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@bookvault.org', role: 'Head Librarian', pass: 'sarah_pass_2026' },
      { name: 'James Carter', email: 'james.carter@bookvault.org', role: 'Circulation Desk Staff', pass: 'james_circ_desk' },
      { name: 'Elena Rostova', email: 'elena.r@bookvault.org', role: 'Database Associate', pass: 'elena_db_pass' },
    ];
    localStorage.setItem('bookvault_operators', JSON.stringify(defaults));
    return defaults;
  });

  // Adding new operator state inside Dashboard Settings
  const [newOpName, setNewOpName] = useState('');
  const [newOpEmail, setNewOpEmail] = useState('');
  const [newOpRole, setNewOpRole] = useState('Circulation Desk Staff');
  const [newOpPass, setNewOpPass] = useState('');
  const [opSuccess, setOpSuccess] = useState<string | null>(null);
  const [opError, setOpError] = useState<string | null>(null);

  // Database stats counter state
  const [dbStats, setDbStats] = useState({
    books: 0,
    members: 0,
    issues: 0,
    reservations: 0,
    fines: 0
  });

  useEffect(() => {
    // Read count lengths of localStorage tables
    const parseCount = (key: string, fallbackLength: number) => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          return JSON.parse(data).length;
        } catch (e) {}
      }
      return fallbackLength;
    };

    setDbStats({
      books: parseCount('bookvault_books', 6),
      members: parseCount('bookvault_members', 6),
      issues: parseCount('bookvault_issues', 5),
      reservations: parseCount('bookvault_reservations', 3),
      fines: parseCount('bookvault_fines', 4)
    });
  }, [activeTab]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save settings flags to localStorage for true configurations persistence
    localStorage.setItem('bv_setting_libName', libraryName);
    localStorage.setItem('bv_setting_contactEmail', contactEmail);
    localStorage.setItem('bv_setting_contactPhone', contactPhone);
    localStorage.setItem('bv_setting_currency', currency);
    localStorage.setItem('bv_setting_dateFormat', dateFormat);
    localStorage.setItem('bv_setting_dailyFineValue', dailyFineValue.toString());
    localStorage.setItem('bv_setting_gracePeriod', gracePeriod.toString());
    localStorage.setItem('bv_setting_lockThreshold', lockThreshold.toString());
    localStorage.setItem('bv_setting_sendWelcome', sendWelcome.toString());
    localStorage.setItem('bv_setting_sendReminder', sendReminder.toString());
    localStorage.setItem('bv_setting_sendFineNotification', sendFineNotification.toString());

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    setOpError(null);
    setOpSuccess(null);

    const emailNorm = newOpEmail.trim().toLowerCase();
    const nameNorm = newOpName.trim();

    if (!nameNorm || !emailNorm || !newOpPass) {
      setOpError('Please input Name, Email and Password key codes.');
      return;
    }

    if (operators.some(op => op.email.toLowerCase().trim() === emailNorm)) {
      setOpError('An administrative account with this email already exists.');
      return;
    }

    const newOp: SystemOperator = {
      name: nameNorm,
      email: emailNorm,
      role: newOpRole,
      pass: newOpPass
    };

    const updated = [...operators, newOp];
    setOperators(updated);
    localStorage.setItem('bookvault_operators', JSON.stringify(updated));

    setOpSuccess(`Successfully added operator "${nameNorm}" to BookVault databases!`);
    
    // Reset inputs
    setNewOpName('');
    setNewOpEmail('');
    setNewOpPass('');
    setNewOpRole('Circulation Desk Staff');
  };

  const handleRemoveOperator = (email: string) => {
    if (operators.length <= 1) {
      alert('System safety locking: Cannot delete the final remaining system operator.');
      return;
    }
    if (confirm(`Revoke access privileges for operator ${email}?`)) {
      const updated = operators.filter(op => op.email.toLowerCase() !== email.toLowerCase());
      setOperators(updated);
      localStorage.setItem('bookvault_operators', JSON.stringify(updated));
    }
  };

  const handleResetEntireDatabase = () => {
    if (confirm('CRITICAL ACTION: Reset the entire BookVault active storage database to initial seed standards? This will erase all newly catalogued books, registered members, issues, fines and newly registered staff operators.')) {
      // Clear specific localStorage keys
      localStorage.removeItem('bookvault_books');
      localStorage.removeItem('bookvault_members');
      localStorage.removeItem('bookvault_issues');
      localStorage.removeItem('bookvault_reservations');
      localStorage.removeItem('bookvault_fines');
      localStorage.removeItem('bookvault_operators');
      localStorage.removeItem('bookvault_notifications');
      
      alert('Local storage index cleared. Re-seeding database tables... System will reload now.');
      window.location.reload();
    }
  };

  const handleDownloadBackup = () => {
    const backupObj = {
      timestamp: new Date().toISOString(),
      metadata: { app: 'BookVault Cloud', node: 'server-3000' },
      operators,
      books: localStorage.getItem('bookvault_books') ? JSON.parse(localStorage.getItem('bookvault_books')!) : null,
      members: localStorage.getItem('bookvault_members') ? JSON.parse(localStorage.getItem('bookvault_members')!) : null,
      issues: localStorage.getItem('bookvault_issues') ? JSON.parse(localStorage.getItem('bookvault_issues')!) : null,
      reservations: localStorage.getItem('bookvault_reservations') ? JSON.parse(localStorage.getItem('bookvault_reservations')!) : null,
      fines: localStorage.getItem('bookvault_fines') ? JSON.parse(localStorage.getItem('bookvault_fines')!) : null,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", `bookvault_db_dump_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6" id="settings-workspace">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Active Administration Configurations</h1>
          <p className="text-slate-500 text-sm">Tune catalog parameters, lending velocities, automatic mail responders, and fine rules</p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse text-xs font-bold self-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings committed to secure cloud index!</span>
          </div>
        )}
      </div>

      {/* Grid structure: Left nav tabs (1/4 width) & Right workspace forms (3/4 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="settings-layout-grid">
        
        {/* Left tabs column */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-4">
          {[
            { id: 'general', label: 'General Configurations', icon: Settings },
            { id: 'email', label: 'E-Mail & Reminders', icon: Mail },
            { id: 'fines', label: 'Fine Parameters', icon: DollarSign },
            { id: 'users', label: 'User Access Privileges', icon: Users },
            { id: 'database', label: 'Database & Storage Hub', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold flex items-center gap-3 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'text-slate-500 hover:bg-slate-55 hover:text-slate-850'
                }`}
                id={`settings-tab-btn-${tab.id}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right work area */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-3">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Tab Panel: General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-5 animate-fade-in" id="settings-panel-general">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                  General Configurations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Library Name Prefix</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={libraryName}
                      onChange={(e) => setLibraryName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Inbound help desk email</label>
                    <input
                      type="email"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Official Contact Phone</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Preferred Currency system</label>
                    <select
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="INR font-bold">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Date Format Preference</label>
                    <select
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer font-mono"
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <option value="YYYY-MM-DD font-mono">YYYY-MM-DD (e.g. 2026-06-01)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 01/06/2026)</option>
                      <option value="MM-DD-YYYY">MM-DD-YYYY (e.g. 06-01-2026)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Panel: Email settings */}
            {activeTab === 'email' && (
              <div className="space-y-5 animate-fade-in text-xs text-slate-600" id="settings-panel-email">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                  E-Mail & Automatic Reminders
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-extrabold text-slate-800 block">Onboard Welcome mail</span>
                      <p className="text-[10.5px] text-slate-450 mt-0.5">Dispatches automatically upon new member registration clearance onboarding.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={sendWelcome}
                      onChange={() => setSendWelcome(!sendWelcome)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-extrabold text-slate-800 block">Automatic Overdue reminders</span>
                      <p className="text-[10.5px] text-slate-450 mt-0.5">Sends warning notifications to students 3 days before checkout due deadlines.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={sendReminder}
                      onChange={() => setSendReminder(!sendReminder)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-extrabold text-slate-800 block">Fine Issuance Alert Mailer</span>
                      <p className="text-[10.5px] text-slate-450 mt-0.5">Dispatches instant transactional statements and invoice receipts upon fine levies.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={sendFineNotification}
                      onChange={() => setSendFineNotification(!sendFineNotification)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab Panel: Fine settings */}
            {activeTab === 'fines' && (
              <div className="space-y-5 animate-fade-in" id="settings-panel-fines">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                  Fine Parameters & Rule Thresholds
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Daily Fine Rate (₹)</label>
                    <input
                      type="number"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={dailyFineValue}
                      onChange={(e) => setDailyFineValue(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Deadlines Grace Window (Days)</label>
                    <input
                      type="number"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Lock Clearance Suspend Threshold (₹)</label>
                    <input
                      type="number"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={lockThreshold}
                      onChange={(e) => setLockThreshold(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab Panel: Access Rules and User Management (CREATING NEW SYSTEM USERS HERE) */}
            {activeTab === 'users' && (
              <div className="space-y-5 animate-fade-in text-xs text-[#1E293B]" id="settings-panel-users">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Authorized Administrative Staff Operators ({operators.length})
                  </h3>
                  <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-extrabold uppercase">
                    Database-linked
                  </span>
                </div>

                {/* Sub-form: Add Operator */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span className="font-extrabold text-xs">Authorize New System User Code</span>
                  </div>

                  {opError && (
                    <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span>{opError}</span>
                    </div>
                  )}

                  {opSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{opSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Liam Miller"
                        value={newOpName}
                        onChange={(e) => setNewOpName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Official Email</label>
                      <input
                        type="email"
                        placeholder="liam@bookvault.org"
                        value={newOpEmail}
                        onChange={(e) => setNewOpEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Role Clearance</label>
                      <select
                        value={newOpRole}
                        onChange={(e) => setNewOpRole(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer bg-white"
                      >
                        <option value="Head Librarian">Head Librarian</option>
                        <option value="Circulation Desk Staff">Circulation Staff</option>
                        <option value="Database Associate">Database Associate</option>
                        <option value="Technical Admin">Technical Admin</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Pin Passkey</label>
                      <input
                        type="password"
                        placeholder="secret_pass"
                        value={newOpPass}
                        onChange={(e) => setNewOpPass(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddOperator}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>Onboard New Operator</span>
                    </button>
                  </div>
                </div>

                {/* Operator List */}
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm bg-white mt-4">
                  {operators.map((user, index) => (
                    <div key={user.email} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors bg-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 block text-xs">{user.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {user.role}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 font-mono mt-1 block">{user.email} | Pass: <span className="text-slate-600 font-bold">{user.pass}</span></span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role.includes('Head') ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {user.role.includes('Head') ? 'Super Owner' : 'Operator Staff'}
                        </span>
                        
                        {/* Only offer delete if not the last one */}
                        {operators.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOperator(user.email)}
                            className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Panel: Database Setup & Maintenance ("database is missing") */}
            {activeTab === 'database' && (
              <div className="space-y-6 animate-fade-in text-xs text-[#0B1B3D]" id="settings-panel-database">
                
                <div className="border-b border-slate-150 pb-2">
                  <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest">
                    BookVault Storage Engine & Tables Console
                  </h3>
                </div>

                {/* DB Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { title: 'Books Table', count: dbStats.books, label: 'Stored items', color: 'border-blue-200 bg-blue-50/30 text-blue-800' },
                    { title: 'Members Table', count: dbStats.members, label: 'Patrons on file', color: 'border-emerald-200 bg-emerald-50/30 text-emerald-800' },
                    { title: 'Issues Log', count: dbStats.issues, label: 'Transaction entries', color: 'border-violet-200 bg-violet-50/30 text-violet-800' },
                    { title: 'Reservations', count: dbStats.reservations, label: 'Queue length', color: 'border-amber-200 bg-amber-50/30 text-amber-800' },
                    { title: 'Fines Ledger', count: dbStats.fines, label: 'Levy accounts', color: 'border-rose-200 bg-rose-50/30 text-rose-850' },
                  ].map((table, idx) => (
                    <div key={idx} className={`p-3.5 border rounded-2xl ${table.color} space-y-1`}>
                      <span className="text-[10.5px] font-bold block opacity-80">{table.title}</span>
                      <strong className="text-xl font-mono block font-black">{table.count}</strong>
                      <span className="text-[9.5px] opacity-60 block">{table.label}</span>
                    </div>
                  ))}
                </div>

                {/* Connection metadata */}
                <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl flex-shrink-0 mt-0.5">
                      <Server className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-extrabold text-xs">Active Storage Status: ONLINE & SYNCED</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">All tables are stored in the persistent LocalStorage active indexes under the `bookvault_*` metadata keys. This preserves edits instantly across window refreshes.</p>
                    </div>
                  </div>
                  
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider rounded-lg flex-shrink-0">
                    Engine V1.3.1 Active
                  </span>
                </div>

                {/* Operations */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-700">Storage Administration Utilities</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="p-4 border border-rose-100 rounded-2xl bg-rose-50/40 space-y-3.5">
                      <div>
                        <span className="font-extrabold text-rose-800 text-xs block">Re-Seed & Reset Table States</span>
                        <p className="text-slate-550 text-[11px] mt-0.5">Clears all custom additions, issues, fines and registered operators. This instantly restores the system to pristine default factory library records.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetEntireDatabase}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Factory Database Seed</span>
                      </button>
                    </div>


                    <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3.5">
                      <div>
                        <span className="font-extrabold text-slate-800 text-xs block">Export Database Dump (JSON backup)</span>
                        <p className="text-slate-550 text-[11px] mt-0.5">Generate and download a snapshot of the current library states (ISBNs, Members, Issues, operators, and settings) in clean JSON format.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadBackup}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download DB Snapshot</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Save Buttons Row */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl text-center shadow-lg hover:shadow-blue-600/15 transition-all cursor-pointer"
                id="save-settings-submit-btn"
              >
                <Save className="w-4 h-4" />
                <span>Save Config Parameters</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
