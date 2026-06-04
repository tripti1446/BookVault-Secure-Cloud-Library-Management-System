import React, { useState } from 'react';
import { BarChart3, Search, Calendar, FileText, Download, CheckSquare, Sparkles, TrendingUp, Filter, HelpCircle } from 'lucide-react';
import { Book, Member, IssuedBook, Fine } from '../types';

interface ReportsViewProps {
  books: Book[];
  members: Member[];
  issues: IssuedBook[];
  fines: Fine[];
}

export default function ReportsView({
  books,
  members,
  issues,
  fines
}: ReportsViewProps) {
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-05-31');
  const [reportType, setReportType] = useState('Circulation');
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Simulated dynamic aggregates based on date ranges
  const filterIssues = issues.filter(i => {
    const d = new Date(i.issueDate);
    return d >= new Date(startDate) && d <= new Date(endDate);
  });

  const totalCirculation = filterIssues.length;
  const overdueTotalCirculation = filterIssues.filter(i => i.status === 'Issued' && new Date(i.dueDate) < new Date('2026-06-01')).length;
  const finesAccruedTotalCirculation = fines
    .filter(f => {
      const d = new Date(f.date);
      return d >= new Date(startDate) && d <= new Date(endDate);
    })
    .reduce((sum, f) => sum + f.amount, 0);

  // Interactive custom SVG Bar chart (Books issued by day)
  const barData = [
    { day: 'Mon', books: 15 },
    { day: 'Tue', books: 28 },
    { day: 'Wed', books: 42 },
    { day: 'Thu', books: 31 },
    { day: 'Fri', books: 38 },
    { day: 'Sat', books: 12 },
    { day: 'Sun', books: 8 },
  ];

  const maxVal = Math.max(...barData.map(b => b.books));
  const svgHeight = 160;
  const svgWidth = 400;
  const padding = 30;

  const handleTriggerExport = (format: 'PDF' | 'Excel') => {
    setExportNotification(`Compiling data... Generating structured ${format} tables.`);
    setTimeout(() => {
      setExportNotification(`Success! "BookVault_Analytical_Report_${reportType}_May26.${format === 'PDF' ? 'pdf' : 'xlsx'}" downloaded successfully.`);
      setTimeout(() => setExportNotification(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="reports-analysis-suite">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Analytical Audits & Reports</h1>
          <p className="text-slate-500 text-sm">Review real-time lending velocity charts, compile statistics summaries, and export ledgers</p>
        </div>

        {/* Dynamic export controls */}
        <div className="flex gap-2.5 self-start">
          <button
            onClick={() => handleTriggerExport('Excel')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-extrabold text-[11px] rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            id="export-excel-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleTriggerExport('PDF')}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-extrabold text-[11px] rounded-xl border border-rose-200 transition-colors cursor-pointer"
            id="export-pdf-btn"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {exportNotification && (
        <div className="bg-blue-50 border border-blue-200 text-blue-850 p-4 rounded-xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* Dynamic range selectors shelf */}
      <div className="bg-white p-4 rounded-xl border border-[#e1e6f0] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full md:w-auto">
          {/* Calendar picker 1 */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono focus:outline-none"
            />
          </div>

          {/* Calendar picker 2 */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Categories selector */}
        <div className="flex gap-2">
          {['Circulation', 'Fine Ledger', 'Shelved Inventories'].map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                reportType === type
                  ? 'bg-[#0B1B3D] text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* KPI Overlooks Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="reports-kpis-row">
        
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Circulation Index</span>
            <p className="text-xl font-black font-mono text-slate-800">{totalCirculation} Issues</p>
          </div>
          <p className="text-[10.5px] text-slate-450 mt-4 leading-normal">Compiled from active university member transactions inside specified range parameters.</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Weekly Fines Collected</span>
            <p className="text-xl font-black font-mono text-emerald-600">₹{finesAccruedTotalCirculation.toLocaleString()}</p>
          </div>
          <p className="text-[10.5px] text-slate-450 mt-4 leading-normal">Accrued outstanding library penalties calculated across registered calendar dates.</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Resolution Window</span>
            <p className="text-xl font-black font-mono text-blue-650">93.7%</p>
          </div>
          <p className="text-[10.5px] text-slate-450 mt-4 leading-normal">Lending turnover indexes reflecting successful checklist returns before deadline dates.</p>
        </div>

      </div>

      {/* Grid of details visualizers (Bar chart week + Donut chart divisions copy) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="reports-detailed-charts-grid">
        
        {/* Books Issued Bar chart (Left) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Books Issued (Weekly Velocity)</h2>
              <p className="text-xs text-slate-400">Total checkouts logged across weekly operations</p>
            </div>
            <span className="text-xs text-blue-600 font-extrabold font-mono flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High volume: Wed
            </span>
          </div>

          {/* SVG Bar Chart container */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[300px]">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding + ratio * (svgHeight - padding * 2);
                return (
                  <g key={index}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={svgWidth - padding}
                      y2={y}
                      stroke="#F8FAFC"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Draw Bars */}
              {barData.map((d, index) => {
                const gap = 12;
                const innerWidth = svgWidth - padding * 2;
                const barWidth = (innerWidth / barData.length) - gap;
                const x = padding + index * (barWidth + gap) + gap / 2;
                
                const barHeight = (d.books / maxVal) * (svgHeight - padding * 2);
                const y = svgHeight - padding - barHeight;

                return (
                  <g key={index} className="group/bar cursor-pointer">
                    {/* Shadow block hover */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill="#3B82F6"
                      className="transition-colors hover:fill-blue-700 duration-200"
                    />
                    {/* Value indicator overlay */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      fill="#1E293B"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150"
                    >
                      {d.books}
                    </text>
                    {/* X-axis labels */}
                    <text
                      x={x + barWidth / 2}
                      y={svgHeight - padding + 15}
                      fill="#64748B"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}

              {/* Baseline axis */}
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={svgHeight - padding}
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Analytical details breakdown (Right) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Security standing assessment logs</h2>
            <p className="text-xs text-slate-400">Inventory and circulation classifications checklist</p>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { label: 'Books Available for Circulation', value: '1,167 vols', rate: '93.7% Shelved stock' },
              { label: 'Outstanding Late-Returns Dues', value: '78 vols', rate: '6.2% active circulation' },
              { label: 'Cleared Invoices standing totals', value: '₹22,450 paid', rate: 'Ledger record closed' },
              { label: 'Unpaid Damage fines ledger', value: '₹2,450 pen', rate: 'Action desk required' },
            ].map((item, id) => (
              <div key={id} className="p-3 bg-slate-50 border border-slate-150/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{item.label}</span>
                  <span className="text-[10px] text-slate-400 block">{item.rate}</span>
                </div>
                <strong className="text-slate-800 font-mono font-bold text-sm tracking-tight">{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 text-[10.5px] italic text-slate-400 leading-normal border-t border-slate-100 pt-3 text-center font-medium">
            System records synced instantly with institutional cloud directories.
          </div>
        </div>

      </div>

    </div>
  );
}
