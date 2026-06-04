import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Bookmark,
  CalendarDays,
  User,
  GraduationCap,
  Sparkles,
  DollarSign,
  AlertTriangle,
  History,
  FileText
} from 'lucide-react';
import { Member, IssuedBook, Fine } from '../types';

interface MembersViewProps {
  members: Member[];
  issues: IssuedBook[];
  fines: Fine[];
  onAddMember: (member: Omit<Member, 'id' | 'joinDate'>) => void;
  onUpdateMember: (member: Member) => void;
  selectedMemberId?: string | null;
  clearSelectedMemberId?: () => void;
}

export default function MembersView({
  members,
  issues,
  fines,
  onAddMember,
  onUpdateMember,
  selectedMemberId,
  clearSelectedMemberId
}: MembersViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'profile'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Student' | 'Faculty'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Profile
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [profileTab, setProfileTab] = useState<'profile' | 'issued' | 'history' | 'fines'>('profile');

  // Form states for Add Member
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState<'Student' | 'Faculty'>('Student');
  const [formDept, setFormDept] = useState('Computer Science');
  const [formAvatar, setFormAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120');

  // Listen to profile selection from external components (e.g., Dashboard or Issue)
  React.useEffect(() => {
    if (selectedMemberId) {
      const m = members.find(item => item.id === selectedMemberId);
      if (m) {
        setActiveMember(m);
        setProfileTab('profile');
        setViewMode('profile');
      }
      if (clearSelectedMemberId) clearSelectedMemberId();
    }
  }, [selectedMemberId, members]);

  // Filter logic
  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || member.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormType('Student');
    setFormDept('Computer Science');
    setFormAvatar('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120');
  };

  const handleOpenAdd = () => {
    resetForm();
    setViewMode('add');
  };

  const handleViewProfile = (member: Member) => {
    setActiveMember(member);
    setProfileTab('profile');
    setViewMode('profile');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMember({
      name: formName || 'Anonymous Member',
      email: formEmail || 'no-contact@uni.edu',
      phone: formPhone || '+91 99999 99999',
      type: formType,
      department: formDept,
      status: 'Active',
      avatar: formAvatar
    });
    setViewMode('list');
  };

  const handleToggleStatus = (member: Member) => {
    onUpdateMember({
      ...member,
      status: member.status === 'Active' ? 'Inactive' : 'Active'
    });
    if (activeMember && activeMember.id === member.id) {
      setActiveMember({
        ...activeMember,
        status: member.status === 'Active' ? 'Inactive' : 'Active'
      });
    }
  };

  // Profile aggregates computations
  const getProfileIssues = () => issues.filter(i => i.memberId === activeMember?.id && i.status === 'Issued');
  const getProfileHistory = () => issues.filter(i => i.memberId === activeMember?.id);
  const getProfileFines = () => fines.filter(f => f.memberId === activeMember?.id);
  const totalFinesAccrued = getProfileFines().reduce((sum, f) => sum + (f.status === 'Pending' ? f.amount : 0), 0);

  return (
    <div className="space-y-6" id="members-view">
      
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {viewMode === 'list' && 'Members Directory'}
            {viewMode === 'add' && 'Onboard Library Member'}
            {viewMode === 'profile' && `${activeMember?.name}'s Desk`}
          </h1>
          <p className="text-slate-500 text-sm">
            {viewMode === 'list' && 'Administer active faculty researcher credentials & student cards'}
            {viewMode === 'add' && 'Register library permissions, specify department affiliations and register contact details'}
            {viewMode === 'profile' && 'Administrative dashboard, fine ledger audit, and active checkout log'}
          </p>
        </div>

        {viewMode === 'list' ? (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl text-center shadow-lg hover:shadow-blue-600/15 transition-all cursor-pointer"
            id="register-new-member-ctrl"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Member</span>
          </button>
        ) : (
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl text-center border border-slate-200 shadow-sm transition-all cursor-pointer"
            id="back-to-member-directory"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Members</span>
          </button>
        )}
      </div>

      {/* VIEW PANEL 1: LIST DIRECTORY GRID */}
      {viewMode === 'list' && (
        <div className="space-y-4" id="members-list-view">
          
          {/* Filters shelf */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/85 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center bg-gradient-to-r from-white via-slate-50/20 to-slate-50/50">
            {/* Search filter */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4" />
              </span>
              <input
                type="text"
                placeholder="Search name, email, ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all font-medium"
                id="members-search-field"
              />
            </div>

            {/* Type selector segment and pills */}
            <div className="flex gap-2">
              {(['All', 'Student', 'Faculty'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { setTypeFilter(type); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    typeFilter === type
                      ? 'bg-[#0B1B3D] text-white'
                      : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type === 'All' ? 'All Roles' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Members list table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="members-data-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Member ID</th>
                    <th className="py-4 px-6">Avatar</th>
                    <th className="py-4 px-6">Name / Details</th>
                    <th className="py-4 px-6">Affiliation Academic</th>
                    <th className="py-4 px-6">Category Type</th>
                    <th className="py-4 px-6">Current Standing</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {paginatedMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/20">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-pulse" />
                        <span>No university members match selection metrics.</span>
                      </td>
                    </tr>
                  ) : (
                    paginatedMembers.map((member) => {
                      const outstandingCount = issues.filter(i => i.memberId === member.id && i.status === 'Issued').length;
                      return (
                        <tr key={member.id} className="hover:bg-slate-50/60 transition-colors group">
                          {/* Member ID */}
                          <td className="py-4 px-6 font-mono font-bold text-slate-400 text-[10px]/none">{member.id}</td>
                          
                          {/* Avatar picture */}
                          <td className="py-4 px-6">
                            <img
                              src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                              alt="Member Profile"
                              className="w-9 h-9 object-cover rounded-xl shadow-inner border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                          </td>

                          {/* Details */}
                          <td className="py-4 px-6">
                            <span
                              onClick={() => handleViewProfile(member)}
                              className="font-bold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors block"
                            >
                              {member.name}
                            </span>
                            <span className="text-[10px] text-slate-450 block truncate max-w-xs">{member.email}</span>
                          </td>

                          {/* Academic Dept */}
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-700">{member.department}</div>
                            <div className="text-[9.5px] text-slate-400 font-mono">D: {member.joinDate}</div>
                          </td>

                          {/* Role category type */}
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              member.type === 'Faculty' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                : 'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {member.type}
                            </span>
                          </td>

                          {/* Standing status badge */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleStatus(member)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer hover:opacity-85 transition-opacity ${
                                  member.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                                title="Toggle Credentials active state"
                              >
                                {member.status}
                              </button>
                              
                              {outstandingCount > 0 && (
                                <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[9px] font-bold">
                                  {outstandingCount} Issued
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleViewProfile(member)}
                              className="flex items-center gap-1 mx-auto py-1 px-2.5 rounded-lg border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 text-[10px] font-bold hover:bg-blue-50/10 shadow-sm transition-all cursor-pointer"
                            >
                              <span>Workstation Dashboard</span>
                              <ArrowRight className="w-3" />
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
              <span>Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredMembers.length)}</strong> of <strong>{filteredMembers.length}</strong> onboarded members</span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === i + 1
                          ? 'bg-[#0B1B3D] text-white'
                          : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW PANEL 2: ADD MEMBER FORM */}
      {viewMode === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 max-w-2xl mx-auto shadow-sm space-y-6 animate-fade-in" id="add-member-form">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Library Card Enrollment Form</h3>
            <p className="text-[11px] text-slate-400">Establish credential clearance profile configurations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase block">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Vance D'souza"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Role selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase block">Academic Affiliation Segment</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as 'Student' | 'Faculty')}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="Student">Student (Renewable 15-day clearance)</option>
                <option value="Faculty">Faculty (Research 30-day clearance)</option>
              </select>
            </div>

            {/* Email contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase block">University email</label>
              <input
                type="email"
                required
                placeholder="e.g. liam.dsouza@university.edu"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase block">Contact Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +91 91100 22334"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
              />
            </div>

            {/* Academic Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase block">Primary Department</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Management">Management</option>
                <option value="Science">Science</option>
                <option value="Arts & Humanities">Arts & Humanities</option>
              </select>
            </div>

            {/* Avatar template selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase block">Representative Profile picture</label>
              <select
                value={formAvatar}
                onChange={(e) => setFormAvatar(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer font-mono text-[10px]"
              >
                <option value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120">F-Avatar 1 (Graceful Portrait)</option>
                <option value="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120">M-Avatar 1 (Urban Style)</option>
                <option value="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120">F-Avatar 2 (Casual Elegant)</option>
                <option value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120">M-Avatar 2 (Studio Creative)</option>
              </select>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs cursor-pointer border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 text-xs cursor-pointer"
              id="confirm-onboard-member-submit"
            >
              Issue University Library ID
            </button>
          </div>
        </form>
      )}

      {/* VIEW PANEL 3: MEMBERS TABBED ANALYTICS WORKSTATION */}
      {viewMode === 'profile' && activeMember && (
        <div className="space-y-6 animate-fade-in" id="member-tabbed-profile-view">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Segment left - Personal summary info card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col justify-between items-stretch">
              <div>
                <div className="relative inline-block mx-auto mb-4">
                  <img
                    src={activeMember.avatar}
                    alt={activeMember.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-offset-2 ring-blue-500/20 mx-auto border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute bottom-[-2px] right-2 inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase ring-2 ring-white text-white ${
                    activeMember.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}>
                    {activeMember.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-800 tracking-tight leading-none mb-1">
                  {activeMember.name}
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  UID: {activeMember.id}
                </span>

                {/* Info grids checklist */}
                <div className="mt-6 space-y-3.5 text-xs text-left text-slate-600 border-t border-b border-slate-100 py-5">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Segment role: <strong className="font-bold text-slate-800">{activeMember.type}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Dept: <strong className="font-bold text-slate-800 truncate block max-w-[130px]" title={activeMember.department}>{activeMember.department}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0 font-mono" />
                    <span className="truncate block max-w-[170px]" title={activeMember.email}>{activeMember.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0 font-mono" />
                    <span>{activeMember.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Enroll date: <strong className="font-bold text-slate-800">{activeMember.joinDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status toggles button */}
              <div className="pt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(activeMember)}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border ${
                    activeMember.status === 'Active'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                  }`}
                >
                  {activeMember.status === 'Active' ? 'Suspend Credentials' : 'Reactivate clearance'}
                </button>
              </div>

            </div>

            {/* Segment right - Tabbed detailed dashboard (3/4 width) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm lg:col-span-3 flex flex-col overflow-hidden">
              
              {/* Tab Navigation header */}
              <div className="border-b border-slate-100 bg-slate-50/50 flex overflow-x-auto">
                {[
                  { id: 'profile', label: 'Overlook Summary', icon: Sparkles },
                  { id: 'issued', label: 'Books Active', icon: Bookmark, count: getProfileIssues().length },
                  { id: 'history', label: 'Reconciliation Log', icon: History, count: getProfileHistory().length },
                  { id: 'fines', label: 'Outstanding Fines', icon: DollarSign, count: getProfileFines().filter(f => f.status === 'Pending').length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setProfileTab(tab.id as any)}
                      className={`px-5 py-4 border-b-2 text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                        profileTab === tab.id
                          ? 'border-blue-600 text-blue-600 bg-white font-black'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                      id={`member-profile-tab-${tab.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[9px] font-bold rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Panels */}
              <div className="p-6 flex-1 overflow-y-auto">
                
                {/* Tab: Overview / Overlook Profile Tab */}
                {profileTab === 'profile' && (
                  <div className="space-y-6 animate-fade-in" id="panel-member-stats">
                    
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl relative overflow-hidden">
                        <span className="text-[9px] font-extrabold text-blue-500 uppercase tracking-wider block mb-1">Active Checkouts</span>
                        <p className="text-xl font-mono font-black text-blue-800">{getProfileIssues().length} Volumes</p>
                        <Bookmark className="absolute right-2 bottom-2 w-12 h-12 text-blue-200/40 pointer-events-none" />
                      </div>

                      <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl relative overflow-hidden">
                        <span className="text-[9px] font-extrabold text-teal-600 uppercase tracking-wider block mb-1">Total Issues Logs</span>
                        <p className="text-xl font-mono font-black text-teal-800">{getProfileHistory().length} Records</p>
                        <History className="absolute right-2 bottom-2 w-12 h-12 text-teal-200/40 pointer-events-none" />
                      </div>

                      <div className={`p-4 rounded-xl relative overflow-hidden border ${
                        totalFinesAccrued > 0 ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider block mb-1 ${
                          totalFinesAccrued > 0 ? 'text-red-500' : 'text-slate-400'
                        }`}>Outstanding Fines</span>
                        <p className={`text-xl font-mono font-black ${
                          totalFinesAccrued > 0 ? 'text-red-600' : 'text-slate-500'
                        }`}>₹{totalFinesAccrued}</p>
                        <DollarSign className="absolute right-2 bottom-2 w-12 h-12 text-slate-100 pointer-events-none" />
                      </div>

                    </div>

                    {/* Operational Standing Assessment */}
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Internal Clearance Standing</h4>
                      
                      {totalFinesAccrued > 500 ? (
                        <div className="flex items-start gap-3 bg-red-100/50 border border-red-200 p-4 rounded-xl text-red-800 text-xs text-left">
                          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600" />
                          <div>
                            <span className="font-extrabold block">SUSPEND CHANNELS STATUS WARNING</span>
                            <p className="text-[11px] leading-relaxed mt-0.5">This student card has exceeded ₹500 in pending fines. Automated issue locks have taken effect. No further books may be borrowed until clear.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 bg-emerald-100/30 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-xs text-left">
                          <GraduationCap className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                          <div>
                            <span className="font-extrabold block">EXCELLENT STANDING APPROVED</span>
                            <p className="text-[11px] leading-relaxed mt-0.5">Authorization clearance matches security requirements. No locks or outstanding warnings registered.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* Tab: Issued Books Tab */}
                {profileTab === 'issued' && (
                  <div className="space-y-4 animate-fade-in" id="panel-member-issued-books">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Active Checkouts Ledger</h4>
                    
                    {getProfileIssues().length === 0 ? (
                      <p className="text-center py-6 text-slate-400 text-xs">No active checked out items are registered to this profile.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden shadow-sm bg-slate-50/20">
                        {getProfileIssues().map(issue => (
                          <div key={issue.id} className="p-3.5 flex items-start gap-3 justify-between bg-white hover:bg-slate-50 text-xs transition-colors">
                            <div>
                              <span className="font-bold text-slate-850 block">{issue.bookTitle}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">ISBN: {issue.bookId} | Issued on: {issue.issueDate}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block mb-0.5">Due Date</span>
                              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-bold text-indigo-700 font-mono">
                                {issue.dueDate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: History Log Tab */}
                {profileTab === 'history' && (
                  <div className="space-y-4 animate-fade-in" id="panel-member-history">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Transaction Logs (Issues / Returns)</h4>

                    {getProfileHistory().length === 0 ? (
                      <p className="text-center py-6 text-slate-400 text-xs">Historical ledger is empty.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden shadow-sm">
                        {getProfileHistory().map(issue => (
                          <div key={issue.id} className="p-3.5 flex items-center justify-between bg-white text-xs">
                            <div>
                              <span className="font-bold text-slate-800 block">{issue.bookTitle}</span>
                              <span className="text-[10px] text-slate-400 font-mono">Tx ID: {issue.id} | Due: {issue.dueDate}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold inline-block ${
                                issue.status === 'Returned' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              }`}>
                                {issue.status}
                              </span>
                              {issue.returnDate && <span className="text-[9.5px] text-slate-400 font-mono">On: {issue.returnDate}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Fines Tab */}
                {profileTab === 'fines' && (
                  <div className="space-y-4 animate-fade-in" id="panel-member-fines">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Individual Fine Account</h4>

                    {getProfileFines().length === 0 ? (
                      <p className="text-center py-6 text-slate-400 text-xs">No fines levied against this student.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden shadow-sm">
                        {getProfileFines().map(fine => (
                          <div key={fine.id} className="p-3.5 flex items-center justify-between bg-white text-xs">
                            <div>
                              <span className="font-bold text-amber-600 font-mono text-[10.5px]">Fine ID: {fine.id}</span>
                              <span className="font-semibold text-slate-800 block mt-0.5">{fine.bookTitle}</span>
                              <span className="text-[10px] text-slate-450 block">{fine.reason}</span>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1.5">
                              <strong className="text-sm font-extrabold text-slate-800 font-mono">₹{fine.amount}</strong>
                              
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                fine.status === 'Paid' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-red-50 text-red-650 border border-red-100'
                              }`}>
                                {fine.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
