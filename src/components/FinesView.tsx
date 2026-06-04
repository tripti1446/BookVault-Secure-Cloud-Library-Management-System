import React, { useState } from 'react';
import { Receipt, Search, CheckCircle2, Ticket, CreditCard, Landmark, DollarSign, Wallet } from 'lucide-react';
import { Fine } from '../types';

interface FinesViewProps {
  fines: Fine[];
  onPayFine: (fineId: string) => void;
}

export default function FinesView({
  fines,
  onPayFine
}: FinesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Paid'>('All');

  // Interactive Payment Modal state
  const [activePaymentFine, setActivePaymentFine] = useState<Fine | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const filteredFines = fines.filter(fine => {
    const matchesSearch =
      fine.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || fine.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPayment = (fine: Fine) => {
    setActivePaymentFine(fine);
    setPaymentSuccess(false);
    setProcessingPayment(false);
  };

  const handleConfirmPayment = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        if (activePaymentFine) {
          onPayFine(activePaymentFine.id);
        }
        setActivePaymentFine(null);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="fines-manager-desk">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Accounts & Fines Clearing</h1>
        <p className="text-slate-500 text-sm">Collect late dues, audit book damage fees and issue digital payment authorization slips</p>
      </div>

      {/* Filter and search segment */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/85 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search invoice ID, student, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            id="fines-search-field"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {(['All', 'Pending', 'Paid'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#0B1B3D] text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {status === 'All' ? 'All Invoices' : `${status} Invoices`}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices data table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="fines-data-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Invoice Dues ID</th>
                <th className="py-4 px-6">Member details</th>
                <th className="py-4 px-6">Overdue Book / Reason</th>
                <th className="py-4 px-6">Levy Date</th>
                <th className="py-4 px-6">Invoice Amount</th>
                <th className="py-4 px-6">Standing Info</th>
                <th className="py-4 px-6 text-center">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs text-slate-600">
              {filteredFines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-450 font-semibold bg-slate-50/20">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-pulse" />
                    <span>No individual fine invoices match parameters.</span>
                  </td>
                </tr>
              ) : (
                filteredFines.map(fine => (
                  <tr key={fine.id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-405 text-[10px]/none">{fine.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{fine.memberName}</div>
                      <div className="text-[10px] text-slate-400">UID: {fine.memberId}</div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-semibold text-slate-700 truncate" title={fine.bookTitle}>{fine.bookTitle}</div>
                      <p className="text-[10px] text-slate-400 leading-snug">{fine.reason}</p>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-505">{fine.date}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-800 text-sm">₹{fine.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        fine.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {fine.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {fine.status === 'Pending' ? (
                        <button
                          onClick={() => handleOpenPayment(fine)}
                          className="bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-xl border border-amber-250 hover:border-transparent transition-all cursor-pointer shadow-sm hover:shadow-amber-500/10"
                        >
                          Credit Settled / Pay Now
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared Ledger</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOAT INTERACTIVE PAYMENT MODAL OVERLAY */}
      {activePaymentFine && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="fine-payment-modal">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 max-w-md w-full shadow-2xl relative space-y-6">
            
            {/* Modal close */}
            <button
              onClick={() => setActivePaymentFine(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <span>Fine Clearance Desk</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Clearing ID: <span className="font-mono font-bold text-slate-600">{activePaymentFine.id}</span></p>
            </div>

            {/* Details and amounts summary */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-450">Payee Member Name:</span>
                <span className="text-slate-800">{activePaymentFine.memberName}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-450">Shelving Infringement:</span>
                <span className="text-slate-800 max-w-[200px] truncate block text-right">{activePaymentFine.bookTitle}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-dashed border-slate-205 pt-2 mt-2">
                <span className="text-slate-500 text-sm">Settlement Total:</span>
                <strong className="text-lg font-black text-blue-600 font-mono">₹{activePaymentFine.amount}</strong>
              </div>
            </div>

            {/* Selection of Payment methods */}
            {!paymentSuccess && (
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gateway Gateway Channels</label>
                
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer ${
                      paymentMethod === 'cash' 
                        ? 'border-blue-500 bg-blue-50/10 text-blue-700 shadow-sm' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    <span>Cash / Desk</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer ${
                      paymentMethod === 'card' 
                        ? 'border-blue-500 bg-blue-50/10 text-blue-700 shadow-sm' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <span>Card POS</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer ${
                      paymentMethod === 'upi' 
                        ? 'border-blue-500 bg-blue-50/10 text-blue-700 shadow-sm' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Landmark className="w-5 h-5 text-slate-400" />
                    <span>UPI QR</span>
                  </button>
                </div>
              </div>
            )}

            {/* Processing and confirm statuses */}
            {paymentSuccess ? (
              <div className="text-center py-4 space-y-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <span className="font-extrabold text-emerald-800 text-sm">Slips cataloged successfully!</span>
                <p className="text-[10px] text-emerald-600">Reconciled system balances in ledger database.</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setActivePaymentFine(null)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 font-bold text-slate-600 border border-slate-200 rounded-xl transition-all text-xs cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={processingPayment}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-600/10 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {processingPayment ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Reconciling...</span>
                    </>
                  ) : (
                    <span>Settle Ledger Dues</span>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
