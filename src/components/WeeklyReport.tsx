/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  addDays, 
  isWithinInterval, 
  parseISO, 
  isFriday,
  previousFriday
} from 'date-fns';
import { ShoppingBag, DollarSign, TrendingUp, Download } from 'lucide-react';
import { formatCurrency } from '../utils';

interface WeeklyReportProps {
  orders: Order[];
}

export default function WeeklyReport({ orders }: WeeklyReportProps) {
  // Logic for Friday to Thursday
  const today = new Date();
  const defaultStart = isFriday(today) ? startOfDay(today) : startOfDay(previousFriday(today));
  const defaultEnd = endOfDay(addDays(defaultStart, 6));

  const [startDate, setStartDate] = useState(format(defaultStart, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(defaultEnd, 'yyyy-MM-dd'));

  const stats = useMemo(() => {
    const s = startOfDay(parseISO(startDate));
    const e = endOfDay(parseISO(endDate));

    const weeklyOrders = orders.filter(o => {
      const d = parseISO(o.date);
      return isWithinInterval(d, { start: s, end: e });
    });

    const revenue = weeklyOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const count = weeklyOrders.length;
    
    const websiteOrders = weeklyOrders.filter(o => o.source === 'Website');
    const facebookOrders = weeklyOrders.filter(o => o.source === 'Facebook');
    
    const websiteCount = websiteOrders.length;
    const facebookCount = facebookOrders.length;
    const websiteRev = websiteOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const facebookRev = facebookOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Performance by person
    const personMap: Record<string, { count: number, revenue: number }> = {};
    weeklyOrders.forEach(o => {
      if (!personMap[o.assignedPerson]) personMap[o.assignedPerson] = { count: 0, revenue: 0 };
      personMap[o.assignedPerson].count++;
      personMap[o.assignedPerson].revenue += o.totalAmount;
    });

    const performance = Object.entries(personMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    return { weeklyOrders, revenue, count, websiteCount, facebookCount, websiteRev, facebookRev, performance };
  }, [orders, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Operational Cycle Report</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Default Window: Friday → Thursday</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
            <input 
              type="date" 
              className="px-2 py-1 border rounded text-xs font-bold outline-none bg-slate-50"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">To</span>
            <input 
              type="date" 
              className="px-2 py-1 border rounded text-xs font-bold outline-none bg-slate-50"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" />
            SAVE PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportCard title="Cycle Orders" value={stats.count.toLocaleString()} subValue="Items processed" icon={ShoppingBag} />
        <ReportCard title="Cycle Revenue" value={formatCurrency(stats.revenue)} subValue="Gross earnings" icon={DollarSign} highlight />
        <div className="grid grid-cols-2 gap-2">
          <ReportCard title="Website" value={stats.websiteCount} subValue={formatCurrency(stats.websiteRev)} icon={TrendingUp} small />
          <ReportCard title="Facebook" value={stats.facebookCount} subValue={formatCurrency(stats.facebookRev)} icon={TrendingUp} small />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-fit">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team Performance Contribution</h4>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 bg-white">
                  <th className="px-6 py-3">Team Member</th>
                  <th className="px-6 py-3 text-center">Orders</th>
                  <th className="px-6 py-3 text-right">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.performance.map(p => (
                  <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-center text-slate-500">{p.count}</td>
                    <td className="px-6 py-4 text-sm text-right font-black text-blue-600">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chronological Log</h4>
          </div>
          <div className="flex-1 max-h-[500px] overflow-y-auto">
             {stats.weeklyOrders.length === 0 ? (
               <div className="p-20 text-center text-slate-300 text-xs font-bold uppercase italic tracking-widest">No matching records</div>
             ) : (
               <table className="w-full text-left">
                 <thead>
                   <tr className="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 sticky top-0 bg-white">
                     <th className="px-6 py-2">Timestamp</th>
                     <th className="px-6 py-2">Customer</th>
                     <th className="px-6 py-2 text-right">Volume</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {stats.weeklyOrders.map(o => (
                     <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-2.5 text-[9px] font-bold text-slate-400">{format(parseISO(o.date), 'dd MMM yyyy')}</td>
                       <td className="px-6 py-2.5 text-xs font-bold text-slate-700">{o.clientName}</td>
                       <td className="px-6 py-2.5 text-xs text-right font-bold text-slate-900 font-mono italic">{formatCurrency(o.totalAmount)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, value, subValue, icon: Icon, highlight, small }: any) {
  return (
    <div className={`p-5 rounded-xl border transition-all ${highlight ? 'bg-[#2563EB] text-white border-blue-600 shadow-blue-200 shadow-lg' : 'bg-white border-slate-200 text-slate-800 shadow-sm'} ${small ? 'p-3' : ''}`}>
      <div className={`flex items-center gap-4 ${small ? 'gap-2' : ''}`}>
        <div className={`p-2.5 rounded-lg ${highlight ? 'bg-blue-500' : 'bg-blue-50 text-blue-600'}`}>
          <Icon className={`${small ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </div>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>{title}</p>
          <p className={`${small ? 'text-lg' : 'text-xl'} font-black`}>{value}</p>
          <p className={`text-[9px] font-medium ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{subValue}</p>
        </div>
      </div>
    </div>
  );
}
