/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { 
  format, 
  isSameDay, 
  parseISO,
  startOfDay
} from 'date-fns';
import { formatCurrency } from '../utils';
import { Clock, Users, Package, CreditCard } from 'lucide-react';

interface DailyReportProps {
  orders: Order[];
}

export default function DailyReport({ orders }: DailyReportProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const stats = useMemo(() => {
    const targetDate = startOfDay(parseISO(selectedDate));
    const dayOrders = orders.filter(o => isSameDay(parseISO(o.date), targetDate));
    
    const revenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const count = dayOrders.length;
    
    // Source breakdown
    const websiteOrders = dayOrders.filter(o => o.source === 'Website');
    const facebookOrders = dayOrders.filter(o => o.source === 'Facebook');
    
    const websiteCount = websiteOrders.length;
    const facebookCount = facebookOrders.length;
    const websiteRev = websiteOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const facebookRev = facebookOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Personnel performance for the day
    const personMap: Record<string, { count: number, rev: number }> = {};
    dayOrders.forEach(o => {
      if (!personMap[o.assignedPerson]) personMap[o.assignedPerson] = { count: 0, rev: 0 };
      personMap[o.assignedPerson].count++;
      personMap[o.assignedPerson].rev += o.totalAmount;
    });

    const performers = Object.entries(personMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.rev - a.rev);

    return { dayOrders, revenue, count, websiteCount, facebookCount, websiteRev, facebookRev, performers };
  }, [orders, selectedDate]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(stats.dayOrders.length / itemsPerPage);
  const paginatedOrders = stats.dayOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Daily Operations Audit</h3>
          <p className="text-sm text-slate-500">{format(parseISO(selectedDate), 'eeee, MMMM do, yyyy')}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Select Date:</label>
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none font-bold"
            value={selectedDate}
            onChange={e => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DailyStat label="Today's Total" value={stats.count.toLocaleString()} sub="Orders" icon={Package} />
          <DailyStat label="Today's Revenue" value={formatCurrency(stats.revenue)} sub="Gross Amount" icon={CreditCard} highlight />
          <DailyStat label="Website Sales" value={stats.websiteCount.toLocaleString()} sub={formatCurrency(stats.websiteRev)} icon={Clock} />
          <DailyStat label="Facebook Sales" value={stats.facebookCount.toLocaleString()} sub={formatCurrency(stats.facebookRev)} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction Log</h4>
               <span className="text-[10px] font-bold text-slate-400 italic">Sorted by Time</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-white border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase">Client</th>
                      <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase">Product</th>
                      <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase text-center">Qty</th>
                      <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-sm">
                   {paginatedOrders.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-300 italic font-medium uppercase tracking-widest text-xs">No orders found for this date</td>
                     </tr>
                   ) : (
                     paginatedOrders.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-3">
                            <p className="font-bold text-slate-700 leading-tight">{o.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{o.phone}</p>
                         </td>
                         <td className="px-6 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${o.source === 'Website' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                {o.source}
                            </span>
                         </td>
                         <td className="px-6 py-3 text-center text-slate-500 font-bold">{o.qty}</td>
                         <td className="px-6 py-3 text-right font-black text-slate-900">{formatCurrency(o.totalAmount)}</td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
             {totalPages > 1 && (
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                            className="px-2 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded disabled:opacity-50"
                        >Prev</button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                            className="px-2 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded disabled:opacity-50"
                        >Next</button>
                    </div>
                </div>
             )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-fit">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Efficiency Ranking</h4>
             </div>
             <div className="p-4 space-y-3">
                 {stats.performers.length === 0 && (
                     <p className="text-center py-10 text-slate-300 text-xs font-bold italic uppercase tracking-tighter">Silence in the system...</p>
                 )}
                 {stats.performers.map((p, idx) => (
                     <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{p.name}</p>
                                <p className="text-[9px] text-slate-400 uppercase font-black">{p.count} Orders Processed</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-blue-600">{formatCurrency(p.rev)}</p>
                        </div>
                     </div>
                 ))}
             </div>
          </div>
      </div>
    </div>
  );
}

function DailyStat({ label, value, sub, icon: Icon, highlight }: any) {
  return (
    <div className={`p-5 rounded-xl border shadow-sm ${highlight ? 'bg-[#2563EB] border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
      <div className="flex justify-between items-start mb-2">
        <p className={`text-[10px] font-black uppercase tracking-wider ${highlight ? 'text-blue-100' : 'text-gray-400'}`}>{label}</p>
        <Icon className={`w-4 h-4 ${highlight ? 'text-blue-300' : 'text-slate-300'}`} />
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className={`text-[9px] font-bold uppercase tracking-tight ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{sub}</p>
    </div>
  );
}
