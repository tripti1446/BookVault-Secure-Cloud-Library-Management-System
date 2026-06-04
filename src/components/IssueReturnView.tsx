import React, { useState } from 'react';
import {
  ArrowUpDown,
  Search,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  BellRing,
  BookmarkCheck,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Book, Member, IssuedBook } from '../types';

interface IssueReturnViewProps {
  books: Book[];
  members: Member[];
  issues: IssuedBook[];
  onIssueBook: (memberId: string, bookId: string, dueDate: string) => void;
  onReturnBook: (transactionId: string) => void;
}

export default function IssueReturnView({
  books,
  members,
  issues,
  onIssueBook,
  onReturnBook
}: IssueReturnViewProps) {
  // Member selection states
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberSuggestions, setShowMemberSuggestions] = useState(false);

  // Book selection states
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookSuggestions, setShowBookSuggestions] = useState(false);

  // Transaction constraints states
  const [issueDate, setIssueDate] = useState('2026-06-01');
  const [dueDate, setDueDate] = useState('2026-06-15'); // 14 days standard

  // Feedback notifications
  const [txSuccessMsg, setTxSuccessMsg] = useState<string | null>(null);

  // Suggestion filters
  const memberSuggestions = memberSearchQuery.trim() === '' 
    ? [] 
    : members.filter(m => 
        m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
        m.id.toLowerCase().includes(memberSearchQuery.toLowerCase())
      );

  const bookSuggestions = bookSearchQuery.trim() === '' 
    ? [] 
    : books.filter(b => 
        (b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) || 
         b.isbn.includes(bookSearchQuery)) && b.available > 0
      );

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setMemberSearchQuery(member.name);
    setShowMemberSuggestions(false);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setBookSearchQuery(book.title);
    setShowBookSuggestions(false);
    
    // Automatically preset return date depending on member clearances
    const incrementDays = selectedMember?.type === 'Faculty' ? 30 : 14;
    const baseDate = new Date('2026-06-01');
    baseDate.setDate(baseDate.getDate() + incrementDays);
    setDueDate(baseDate.toISOString().split('T')[0]);
  };

  const executeIssueCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !selectedBook) return;

    if (selectedBook.available <= 0) {
      alert('Selected book has no available copies shelved at this moment.');
      return;
    }

    onIssueBook(selectedMember.id, selectedBook.id, dueDate);
    
    setTxSuccessMsg(`Successfully issued ${selectedBook.title} to ${selectedMember.name}!`);
    setTimeout(() => setTxSuccessMsg(null), 5000);

    // Reset selection states
    setBookSearchQuery('');
    setSelectedBook(null);
  };

  const handleExecuteReturn = (txId: string, title: string) => {
    onReturnBook(txId);
    setTxSuccessMsg(`Book "${title}" has been successfully checked in and restocked.`);
    setTimeout(() => setTxSuccessMsg(null), 5000);
  };

  // Get active selected list
  const memberHistory = selectedMember 
    ? issues.filter(i => i.memberId === selectedMember.id) 
    : [];

  return (
    <div className="space-y-6" id="circulation-workspace">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Issue / Return Workstation</h1>
        <p className="text-slate-500 text-sm">Unified front desk console for real-time lending, credentials audit, and returns filing</p>
      </div>

      {txSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
          <span>{txSuccessMsg}</span>
        </div>
      )}

      {/* CORE 3-PANEL CIRCULATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="circulation-split-workspace">
        
        {/* PANEL 1: CLIENT IDENTITY AND VERIFICATION (LEFT) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Step 1: Auditing Member Credentials
            </h3>

            {/* Member search autocomplete input */}
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Search University Member</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Type member name or UID (M-...)"
                  value={memberSearchQuery}
                  onChange={(e) => {
                    setMemberSearchQuery(e.target.value);
                    setShowMemberSuggestions(true);
                    if (selectedMember) setSelectedMember(null);
                  }}
                  onFocus={() => setShowMemberSuggestions(true)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  id="circulation-member-search"
                />
              </div>

              {/* Suggestions overlay */}
              {showMemberSuggestions && memberSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {memberSuggestions.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMember(m)}
                      className="w-full text-left p-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-xs"
                    >
                      <img src={m.avatar} alt="" className="w-7 h-7 object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div>
                        <span className="font-extrabold text-slate-800 block leading-tight">{m.name}</span>
                        <span className="text-[9.5px] text-slate-400 font-mono">ID: {m.id} | Dept: {m.department}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Member profile display card */}
            {selectedMember ? (
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3.5 animate-fade-in" id="active-circulation-member">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMember.avatar}
                    className="w-12 h-12 object-cover rounded-xl border"
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-extrabold text-slate-800 text-sm block leading-snug">{selectedMember.name}</span>
                    <span className="text-[10px] text-slate-404 uppercase font-bold tracking-wide">{selectedMember.type} ({selectedMember.department})</span>
                  </div>
                </div>

                {/* Audit properties */}
                <div className="space-y-2 text-xs border-t border-slate-200/50 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Security Clearance:</span>
                    <span className={`font-bold uppercase text-[9.5px] px-2 py-0.2 rounded-full ${
                      selectedMember.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {selectedMember.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Dues Owed:</span>
                    <span className={`font-mono font-bold ${
                      issues.some(i => i.memberId === selectedMember.id && i.fineAmount > 0) ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      ₹{issues.filter(i => i.memberId === selectedMember.id).reduce((sum, i) => sum + i.fineAmount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Active Checkout Count:</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {issues.filter(i => i.memberId === selectedMember.id && i.status === 'Issued').length} Books
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <User className="w-8 h-8 text-slate-300" />
                <span>Input active university member clearance to audit system credentials standing.</span>
              </div>
            )}
          </div>

          {selectedMember && (
            <div className="bg-[#0B1B3D] text-indigo-200 text-[10px] p-3 rounded-xl border border-[#152e61] flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>ACTIVE REGISTRATION VERIFIED</span>
            </div>
          )}
        </div>

        {/* PANEL 2: VOLUME SPECIFICATIONS CHECKOUT FORM (MIDDLE) */}
        <form onSubmit={executeIssueCheckout} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Step 2: Book Selection & Dates
            </h3>

            {/* Book picker suggestions input */}
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Look Up Catalogue Title</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Type book title, ISBN..."
                  value={bookSearchQuery}
                  onChange={(e) => {
                    setBookSearchQuery(e.target.value);
                    setShowBookSuggestions(true);
                    if (selectedBook) setSelectedBook(null);
                  }}
                  onFocus={() => setShowBookSuggestions(true)}
                  disabled={!selectedMember || selectedMember.status !== 'Active'}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  id="circulation-book-search"
                />
              </div>

              {/* Suggestions dropdown overlay */}
              {showBookSuggestions && bookSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {bookSuggestions.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBook(b)}
                      className="w-full text-left p-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-xs"
                    >
                      <div className={`w-6 h-8 rounded bg-gradient-to-br ${b.coverColor} flex-shrink-0`} />
                      <div>
                        <span className="font-extrabold text-slate-800 block leading-tight">{b.title}</span>
                        <span className="text-[9.5px] text-slate-400">Author: {b.author} | Copies left: {b.available} vols</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Show selected book summary cover details inline */}
            {selectedBook ? (
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3.5 animate-fade-in" id="active-circulation-book">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${selectedBook.coverColor} flex-shrink-0 shadow-md`} />
                  <div>
                    <span className="font-extrabold text-slate-800 text-xs block leading-tight">{selectedBook.title}</span>
                    <span className="text-[10px] text-slate-500 block">by {selectedBook.author}</span>
                    <span className="text-[9px] text-slate-400 font-mono block mt-1">ISBN: {selectedBook.isbn}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-white border border-slate-100 p-2 rounded-lg shadow-inner">
                  <span>Shelving: <strong className="font-bold text-slate-805">{selectedBook.location}</strong></span>
                  <span>Available: <strong className="font-bold text-slate-805">{selectedBook.available} of {selectedBook.copies}</strong></span>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2 bg-slate-50/20">
                <BookOpen className="w-8 h-8 text-slate-350" />
                <span>Select active volume from catalog database. (Requires verified Member ID first).</span>
              </div>
            )}

            {/* Date Pickers Container */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  disabled={!selectedMember}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-mono focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={!selectedMember}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedMember || !selectedBook}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-blue-600/15 transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            id="issue-book-submit-btn"
          >
            <span>Execute Book Issue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* PANEL 3: CURRENT STANDING ISSUE HISTORY / QUICK CHECK IN (RIGHT) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Step 3: Verification & Active History
            </h3>

            {/* List history of selected student */}
            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
              {!selectedMember ? (
                <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center gap-2">
                  <BookmarkCheck className="w-8 h-8 text-slate-300" />
                  <span>Select a member on the left panel to scan and audit their current holdings desk.</span>
                </div>
              ) : memberHistory.length === 0 ? (
                <p className="text-center py-10 text-xs text-slate-400 font-semibold bg-slate-50/10 rounded-xl border border-dashed">
                  This student has zero outstanding volumes held or archived.
                </p>
              ) : (
                memberHistory.map(issue => (
                  <div
                    key={issue.id}
                    className="p-3 border border-slate-150/60 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-colors bg-slate-50/30"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="font-extrabold text-slate-850 block truncate" title={issue.bookTitle}>
                        {issue.bookTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">Tx: {issue.id} | Due: {issue.dueDate}</span>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          issue.status === 'Issued' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {issue.status}
                        </span>
                        {issue.fineAmount > 0 && (
                          <span className="bg-amber-100 px-1.5 rounded font-mono text-amber-700 font-bold text-[9px]">
                            ₹{issue.fineAmount} Fine
                          </span>
                        )}
                      </div>
                    </div>

                    {issue.status === 'Issued' && (
                      <button
                        type="button"
                        onClick={() => handleExecuteReturn(issue.id, issue.bookTitle)}
                        className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold rounded-lg border border-emerald-200/50 hover:border-transparent text-[10.5px] transition-all cursor-pointer whitespace-nowrap self-center"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedMember && (
            <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-center text-[11px] text-slate-500 font-medium">
              Check in physically returned items here.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
