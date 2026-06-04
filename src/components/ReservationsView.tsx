import React, { useState } from 'react';
import { CalendarCheck, Search, Trash2, CheckCircle2, Ticket, HelpCircle, XCircle } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationsViewProps {
  reservations: Reservation[];
  onClaimPickup: (reserveId: string) => void;
  onCancelHold: (reserveId: string) => void;
}

export default function ReservationsView({
  reservations,
  onClaimPickup,
  onCancelHold
}: ReservationsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ready for Pickup' | 'Pending' | 'Cancelled'>('All');

  const filteredReservations = reservations.filter(res => {
    const matchesSearch =
      res.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="reservations-workspace">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Active Reservations & Holds</h1>
        <p className="text-slate-500 text-sm">Monitor user reservation queues, pick-up readiness windows and dispatch holds desk</p>
      </div>

      {/* Primary search shelf */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/85 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search hold ID, book, member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            id="reservations-search"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {(['All', 'Ready for Pickup', 'Pending', 'Cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#0B1B3D] text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reservation Data view table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="reservations-data-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Hold ID</th>
                <th className="py-4 px-6">Book Title</th>
                <th className="py-4 px-6">Reserving Member</th>
                <th className="py-4 px-6">Date Placed</th>
                <th className="py-4 px-6">Queue Status</th>
                <th className="py-4 px-6 text-center">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs text-slate-600">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-450 font-semibold bg-slate-50/20">
                    <CalendarCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>No active holds in selected queue category.</span>
                  </td>
                </tr>
              ) : (
                filteredReservations.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-405 text-[10px]/none">{res.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-800 max-w-xs truncate">{res.bookTitle}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-700">{res.memberName}</div>
                      <div className="text-[10px] text-slate-400">ID: {res.memberId}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500">{res.reserveDate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        res.status === 'Ready for Pickup' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 animate-pulse' :
                        res.status === 'Cancelled' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-150'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        {res.status === 'Ready for Pickup' && (
                          <button
                            onClick={() => onClaimPickup(res.id)}
                            className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-[10px] px-3 py-1.5 rounded-lg border border-emerald-250 hover:border-transparent transition-colors cursor-pointer"
                          >
                            Claim Pickup
                          </button>
                        )}
                        {res.status === 'Pending' && (
                          <span className="text-[10px] text-slate-400 font-semibold italic">Awaiting return inventory</span>
                        )}
                        {res.status !== 'Cancelled' ? (
                          <button
                            onClick={() => onCancelHold(res.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-450 hover:text-rose-600 transition-colors rounded-lg cursor-pointer"
                            title="Cancel HOLD slot"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">Holds closed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
