import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import BooksView from './components/BooksView';
import MembersView from './components/MembersView';
import IssueReturnView from './components/IssueReturnView';
import ReservationsView from './components/ReservationsView';
import FinesView from './components/FinesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';

import { Book, Member, IssuedBook, Reservation, Fine, LibraryNotification } from './types';
import {
  INITIAL_BOOKS,
  INITIAL_MEMBERS,
  INITIAL_ISSUES,
  INITIAL_RESERVATIONS,
  INITIAL_FINES,
  INITIAL_NOTIFICATIONS
} from './initialData';

import {
  Database,
  CloudLightning,
  RefreshCw,
  Search,
  BookOpen,
  Users,
  Receipt,
  ArrowUpDown,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [operatorEmail, setOperatorEmail] = useState<string>('sarah.jenkins@bookvault.org');

  // Navigation sidebar collapse and view routing states
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Global transactional states (Dynamic Persistent Database)
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('bookvault_books');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('bookvault_books', JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('bookvault_members');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('bookvault_members', JSON.stringify(INITIAL_MEMBERS));
    return INITIAL_MEMBERS;
  });

  const [issues, setIssues] = useState<IssuedBook[]>(() => {
    const saved = localStorage.getItem('bookvault_issues');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('bookvault_issues', JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('bookvault_reservations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('bookvault_reservations', JSON.stringify(INITIAL_RESERVATIONS));
    return INITIAL_RESERVATIONS;
  });

  const [fines, setFines] = useState<Fine[]>(() => {
    const saved = localStorage.getItem('bookvault_fines');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('bookvault_fines', JSON.stringify(INITIAL_FINES));
    return INITIAL_FINES;
  });

  const [notifications, setNotifications] = useState<LibraryNotification[]>(() => {
    const saved = localStorage.getItem('bookvault_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('bookvault_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  });

  // Database auto-replications sync handlers
  useEffect(() => {
    localStorage.setItem('bookvault_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('bookvault_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('bookvault_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('bookvault_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('bookvault_fines', JSON.stringify(fines));
  }, [fines]);

  useEffect(() => {
    localStorage.setItem('bookvault_notifications', JSON.stringify(notifications));
  }, [notifications]);


  // Cross-view deep linking states: passing matched results straight to relevant catalog specs
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Global search matching
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');

  // Backup progress simulation
  const [backupLoading, setBackupLoading] = useState<boolean>(false);
  const [backupPercent, setBackupPercent] = useState<number>(0);
  const [backupCompleteTime, setBackupCompleteTime] = useState<string>('Today at 04:00 AM');

  // Trigger cold cloud state backup
  const handleBackupReplication = () => {
    setBackupLoading(true);
    setBackupPercent(0);
    const interval = setInterval(() => {
      setBackupPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupLoading(false);
          const nowStr = new Date().toLocaleTimeString();
          setBackupCompleteTime(`Today at ${nowStr}`);
          
          // Append success backup notification
          setNotifications(old => [
            {
              id: `NT-BCK-${Date.now()}`,
              title: 'Database Backup Completed',
              message: 'Local catalog index successfully uploaded and replicated to backup vault nodes.',
              type: 'success',
              time: 'Just now',
              read: false
            },
            ...old
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // State modifiers: Books CRUD
  const handleAddBook = (newBookData: Omit<Book, 'id'>) => {
    const nextId = `B-${100 + books.length + 1}`;
    const nextBook: Book = {
      ...newBookData,
      id: nextId
    };
    setBooks(prev => [nextBook, ...prev]);

    // Append alert notification
    setNotifications(old => [
      {
        id: `NT-BK-${Date.now()}`,
        title: 'New Volume Catalogued',
        message: `Title "${newBookData.title}" was published to shelf location ${newBookData.location}.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(item => item.id === updatedBook.id ? updatedBook : item));
  };

  const handleDeleteBook = (id: string) => {
    const target = books.find(b => b.id === id);
    setBooks(prev => prev.filter(item => item.id !== id));
    
    setNotifications(old => [
      {
        id: `NT-BKD-${Date.now()}`,
        title: 'Volume Withdrawn',
        message: `Catalog reference Book ID ${id} (${target?.title || 'Unknown'}) was removed from circulation.`,
        type: 'warning',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  // State modifiers: Members CRUD
  const handleAddMember = (newMem: Omit<Member, 'id' | 'joinDate'>) => {
    const nextId = `M-${300 + members.length + 1}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const member: Member = {
      ...newMem,
      id: nextId,
      joinDate: todayStr
    };
    setMembers(prev => [member, ...prev]);

    setNotifications(old => [
      {
        id: `NT-MEM-${Date.now()}`,
        title: 'New Member Registered',
        message: `${newMem.name} (${newMem.type}) has been granted clearance for primary ${newMem.department} libraries.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  const handleUpdateMember = (updatedMem: Member) => {
    setMembers(prev => prev.map(item => item.id === updatedMem.id ? updatedMem : item));
  };

  // State modifiers: Circulation Desk - Issue Book
  const handleIssueBook = (memberId: string, bookId: string, dueDate: string) => {
    const member = members.find(m => m.id === memberId);
    const book = books.find(b => b.id === bookId);
    if (!member || !book) return;

    const nextId = `TX-${500 + issues.length + 1}`;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const nextIssue: IssuedBook = {
      id: nextId,
      bookId,
      bookTitle: book.title,
      author: book.author,
      memberId,
      memberName: member.name,
      issueDate: todayStr,
      dueDate,
      status: 'Issued',
      fineAmount: 0
    };

    setIssues(prev => [nextIssue, ...prev]);

    // Decrement available books counter
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, available: Math.max(b.available - 1, 0) } : b))
    );

    // Notify
    setNotifications(old => [
      {
        id: `NT-IS-${Date.now()}`,
        title: 'Book Checkout Event',
        message: `"${book.title}" was issued to ${member.name}. Return expected on ${dueDate}.`,
        type: 'info',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  // State modifiers: Circulation Desk - Return Book
  const handleReturnBook = (transactionId: string) => {
    const transaction = issues.find(i => i.id === transactionId);
    if (!transaction) return;

    const todayStr = new Date().toISOString().split('T')[0];

    setIssues(prev =>
      prev.map(item =>
        item.id === transactionId
          ? { ...item, status: 'Returned', returnDate: todayStr }
          : item
      )
    );

    // Increment available books counter
    setBooks(prev =>
      prev.map(b => (b.id === transaction.bookId ? { ...b, available: b.available + 1 } : b))
    );

    setNotifications(old => [
      {
        id: `NT-RT-${Date.now()}`,
        title: 'Book Checked In',
        message: `Checked out item "${transaction.bookTitle}" has been returned by ${transaction.memberName}. Stock restowed.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  // State modifiers: Fines payments
  const handlePayFine = (fineId: string) => {
    const targetedFine = fines.find(f => f.id === fineId);
    if (!targetedFine) return;

    setFines(prev =>
      prev.map(item => (item.id === fineId ? { ...item, status: 'Paid' } : item))
    );

    // Append historical payment confirmation notify
    setNotifications(old => [
      {
        id: `NT-FP-${Date.now()}`,
        title: 'Receipt: Fine Payment',
        message: `Fine invoice payment for ${targetedFine.memberName} settled. Ledger cleared.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  // State modifiers: Reservations hold pickup fulfillment
  const handleClaimPickup = (reserveId: string) => {
    const claim = reservations.find(r => r.id === reserveId);
    if (!claim) return;

    // 1. Mark reservation ready to claim status as Picked
    setReservations(prev => prev.filter(r => r.id !== reserveId));

    // 2. Automatically trigger transaction lending checkout (standard grace 14-days)
    const incrementalDateStr = '2026-06-15';
    handleIssueBook(claim.memberId, claim.bookId, incrementalDateStr);
    
    setNotifications(old => [
      {
        id: `NT-RC-${Date.now()}`,
        title: 'Hold Picked Up',
        message: `Reserved hold claimed. Checkout transaction opened for ${claim.memberName}.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  const handleCancelHold = (reserveId: string) => {
    setReservations(prev =>
      prev.map(item => (item.id === reserveId ? { ...item, status: 'Cancelled' } : item))
    );

    setNotifications(old => [
      {
        id: `NT-RC-${Date.now()}`,
        title: 'Hold Hold Cancelled',
        message: `Reservation hold ID ${reserveId} closed and released from queue lines.`,
        type: 'warning',
        time: 'Just now',
        read: false
      },
      ...old
    ]);
  };

  // Notifications callbacks
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Shortcut filters for selecting lists globally (passing matched values directly to Views)
  const handleGlobalDeepSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setGlobalSearchTerm('');
    setCurrentView('books');
  };

  const handleGlobalDeepSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setGlobalSearchTerm('');
    setCurrentView('members');
  };

  // Global search filters matches computation
  const matchedBooks = globalSearchTerm.trim() === ''
    ? []
    : books.filter(b => b.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) || b.isbn.includes(globalSearchTerm));

  const matchedMembers = globalSearchTerm.trim() === ''
    ? []
    : members.filter(m => m.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) || m.id.toLowerCase().includes(globalSearchTerm.toLowerCase()));

  const matchedFines = globalSearchTerm.trim() === ''
    ? []
    : fines.filter(f => f.memberName.toLowerCase().includes(globalSearchTerm.toLowerCase()) || f.id.toLowerCase().includes(globalSearchTerm.toLowerCase()));

  const hasGlobalSearchResults = globalSearchTerm.trim() !== '';

  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={(email) => {
          setOperatorEmail(email);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="flex bg-[#F4F7FC] min-h-screen text-slate-800 font-sans" id="bookvault-viewport">
      
      {/* Dynamic left sidebar navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setGlobalSearchTerm(''); // Clear search on menu jumps
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
      />

      {/* Main Right panel containing Header + Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0" id="workbench-container">
        
        {/* Dynamic header row */}
        <Header
          searchTerm={globalSearchTerm}
          onSearch={setGlobalSearchTerm}
          onViewChange={(v) => {
            setCurrentView(v);
            setGlobalSearchTerm('');
          }}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearAllNotifications={handleClearAllNotifications}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          operatorEmail={operatorEmail}
        />

        {/* Content panel view containers */}
        <main className="flex-grow p-6 overflow-y-auto">
          
          {/* RENDER VIEW PORTAL 1: GLOBAL SEARCH RESULTS OVERLAY (IF MATCHING SEARCH) */}
          {hasGlobalSearchResults ? (
            <div className="space-y-6 animate-fade-in" id="global-search-results-portal">
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Global search: "{globalSearchTerm}"</h1>
                <p className="text-slate-400 text-xs">Matching entries in catalogue datasets, university rosters and accounts directories</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Book matches category */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between border-b pb-2">
                    <span>Shell volumes matches</span>
                    <span className="font-mono">{matchedBooks.length} Found</span>
                  </h3>

                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-1">
                    {matchedBooks.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-6">No matching books found</p>
                    ) : (
                      matchedBooks.map(b => (
                        <div
                          key={b.id}
                          onClick={() => handleGlobalDeepSelectBook(b.id)}
                          className="py-2.5 flex items-start gap-3 hover:bg-slate-50 rounded-lg px-1 transition-colors cursor-pointer text-xs"
                        >
                          <div className={`w-8 h-10 rounded bg-gradient-to-br ${b.coverColor} flex-shrink-0`} />
                          <div>
                            <span className="font-bold text-slate-850 block">{b.title}</span>
                            <span className="text-[10px] text-slate-450">Author: {b.author} | Shelf: {b.location}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Member matches category */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between border-b pb-2">
                    <span>Registered university matches</span>
                    <span className="font-mono">{matchedMembers.length} Found</span>
                  </h3>

                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-1">
                    {matchedMembers.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-6">No matching members found</p>
                    ) : (
                      matchedMembers.map(m => (
                        <div
                          key={m.id}
                          onClick={() => handleGlobalDeepSelectMember(m.id)}
                          className="py-2.5 flex items-center gap-3 hover:bg-slate-50 rounded-lg px-1 transition-colors cursor-pointer text-xs"
                        >
                          <img src={m.avatar} className="w-8 h-8 object-cover rounded-lg" referrerPolicy="no-referrer" alt="" />
                          <div>
                            <span className="font-bold text-slate-850 block">{m.name}</span>
                            <span className="text-[10px] text-slate-450">{m.type} Affiliated ({m.id})</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Account invoices matches category */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 md:col-span-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between border-b pb-2">
                    <span>Accounts fine invoice queries</span>
                    <span className="font-mono">{matchedFines.length} Invoices</span>
                  </h3>

                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {matchedFines.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-6">No matching invoices found</p>
                    ) : (
                      matchedFines.map(f => (
                        <div
                          key={f.id}
                          onClick={() => {
                            setCurrentView('fines');
                            setGlobalSearchTerm('');
                          }}
                          className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                        >
                          <div>
                            <strong className="text-slate-800">{f.memberName} (UID: {f.memberId})</strong>
                            <p className="text-[10.5px] text-slate-450 mt-0.5">{f.bookTitle} - {f.reason}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold block">₹{f.amount}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              f.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                            }`}>{f.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
              
              <div className="text-center pt-2">
                <button
                  onClick={() => setGlobalSearchTerm('')}
                  className="px-5 py-2 bg-slate-200/60 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm border border-slate-300/40"
                >
                  Clear search and return to previous drawer
                </button>
              </div>
            </div>
          ) : (
            
            /* ROUTING CHANNELS VIEWPORT */
            <>
              {/* view: DASHBOARD */}
              {currentView === 'dashboard' && (
                <DashboardView
                  books={books}
                  members={members}
                  issues={issues}
                  fines={fines}
                  notifications={notifications}
                  onViewChange={setCurrentView}
                  onSelectBook={handleGlobalDeepSelectBook}
                  onSelectMember={handleGlobalDeepSelectMember}
                />
              )}

              {/* view: BOOKS CATALOG */}
              {currentView === 'books' && (
                <BooksView
                  books={books}
                  onAddBook={handleAddBook}
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                  selectedBookId={selectedBookId}
                  clearSelectedBookId={() => setSelectedBookId(null)}
                />
              )}

              {/* view: MEMBERS INDEX */}
              {currentView === 'members' && (
                <MembersView
                  members={members}
                  issues={issues}
                  fines={fines}
                  onAddMember={handleAddMember}
                  onUpdateMember={handleUpdateMember}
                  selectedMemberId={selectedMemberId}
                  clearSelectedMemberId={() => setSelectedMemberId(null)}
                />
              )}

              {/* view: CIRCULATION DESK ISSUE / RETURN */}
              {currentView === 'issue-return' && (
                <IssueReturnView
                  books={books}
                  members={members}
                  issues={issues}
                  onIssueBook={handleIssueBook}
                  onReturnBook={handleReturnBook}
                />
              )}

              {/* view: RESERVATIONS */}
              {currentView === 'reservations' && (
                <ReservationsView
                  reservations={reservations}
                  onClaimPickup={handleClaimPickup}
                  onCancelHold={handleCancelHold}
                />
              )}

              {/* view: OUTSTANDING FINES */}
              {currentView === 'fines' && (
                <FinesView
                  fines={fines}
                  onPayFine={handlePayFine}
                />
              )}

              {/* view: REPORTS VISUALIZERS */}
              {currentView === 'reports' && (
                <ReportsView
                  books={books}
                  members={members}
                  issues={issues}
                  fines={fines}
                />
              )}

              {/* view: NOTIFICATIONS CENTRE */}
              {currentView === 'notifications' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in" id="notifications-archive-panel">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">System notifications log</h2>
                      <p className="text-slate-400 text-xs">Chronological operational activity stream index</p>
                    </div>

                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAllNotifications}
                        className="text-xs text-rose-500 hover:text-rose-600 underline font-semibold decoration-dotted cursor-pointer"
                        id="purge-notifications-list-btn"
                      >
                        Purge notifications list
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto space-y-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-20 text-slate-400 text-xs space-y-2">
                        <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto" />
                        <span className="font-semibold block">Notification list is completely clean!</span>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="py-3.5 flex gap-3 text-xs justify-between align-start hover:bg-slate-50/50 rounded-lg px-2">
                          <div className="flex gap-3">
                            <span className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                              n.type === 'alert' ? 'bg-red-500' :
                              n.type === 'warning' ? 'bg-amber-500' :
                              n.type === 'success' ? 'bg-emerald-500' :
                              'bg-blue-500'
                            }`} />
                            <div>
                              <strong className="text-slate-800 block text-xs">{n.title}</strong>
                              <p className="text-slate-500 leading-relaxed mt-0.5 text-[11px]">{n.message}</p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 pl-3">
                            <span className="text-[10px] text-slate-400 block font-mono">{n.time}</span>
                            {!n.read && (
                              <button
                                onClick={() => handleMarkNotificationRead(n.id)}
                                className="text-[10px] text-blue-600 hover:underline mt-1 font-bold"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* view: SYSTEM PARAMETERS ADMIN CONFIG */}
              {currentView === 'settings' && <SettingsView />}

              {/* view: BACKUP AND REPLICATION COLD LOGS */}
              {currentView === 'backup' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in" id="backup-replication-panel">
                  <div className="border-b pb-3">
                    <h2 className="text-base font-extrabold text-[#0B1B3D] uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span>Local Registry Backup & Cloud Replication</span>
                    </h2>
                    <p className="text-slate-400 text-xs mt-0.5">Automated replication log standing and off-site archives schedules</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border rounded-xl text-xs space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Local Host Health</span>
                      <strong className="text-emerald-600 block text-sm font-semibold uppercase">● Secured Operational Online</strong>
                      <span className="text-slate-400 block">Node: cloud-server-container-3000</span>
                    </div>

                    <div className="p-4 bg-slate-50 border rounded-xl text-xs space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Last Replicated Synced</span>
                      <strong className="text-slate-800 block text-sm font-mono">{backupCompleteTime}</strong>
                      <span className="text-slate-400 block">Target node: main-aws-active-east</span>
                    </div>
                  </div>

                  {backupLoading ? (
                    <div className="space-y-3 bg-blue-50/50 p-5 rounded-xl border border-blue-105" id="backup-progression">
                      <div className="flex justify-between items-center text-xs font-bold text-blue-800">
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                          <span>Executing incremental checksum compression catalog...</span>
                        </span>
                        <span className="font-mono">{backupPercent}%</span>
                      </div>
                      <div className="w-full bg-blue-200/50 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-150" style={{ width: `${backupPercent}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-indigo-50/30 p-5 rounded-xl border border-indigo-100 flex flex-col md:flex-row items-center gap-4 justify-between">
                      <div className="text-xs">
                        <span className="font-extrabold text-slate-800 block">Execute Manual Cold State Replication</span>
                        <p className="text-slate-500 mt-0.5">Compresses transactional logs index, active database instances, and registers checklist seeds safely to secure container back-archives.</p>
                      </div>

                      <button
                        onClick={handleBackupReplication}
                        className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-blue-600/10 transition-all cursor-pointer whitespace-nowrap text-center self-stretch md:self-auto"
                        id="trigger-backup-now"
                      >
                        Trigger Cloud Backup
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* view: LOGOUT SCREEN */}
              {currentView === 'logout' && (
                <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4" id="logout-cover-screen">
                  <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-slate-200">
                    <div className="h-16 w-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto animate-pulse">
                      <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-black text-slate-850 tracking-tight leading-none uppercase">Session successfully terminated</h2>
                      <p className="text-xs text-slate-400">Credentials locks are active. Access portal is currently restricted.</p>
                    </div>

                    <div className="bg-slate-50 border rounded-xl p-4 text-xs space-y-1">
                      <span className="font-semibold text-slate-450 uppercase block text-[9px] tracking-wide">Last Signed Operator</span>
                      <strong className="text-slate-800 text-xs block">{operatorEmail}</strong>
                      <span className="text-indigo-600 font-bold block text-[10px]">Active Clearance Session</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        setCurrentView('dashboard');
                      }}
                      className="w-full py-2.5 bg-[#0B1B3D] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors cursor-pointer text-center"
                      id="logout-back-signin-btn"
                    >
                      Return to Access Portal
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

    </div>
  );
}
