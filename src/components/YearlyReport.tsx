/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { 
  format, 
  startOfYear, 
  endOfYear, 
  parseISO,
  eachMonthOfInterval,
  isSameYear
} from 'date-fns';
import { formatCurrency } from '../utils';
import { Bar } from 'react-chartjs-2';

interface YearlyReportProps {
  orders: Order[];
}

export default function YearlyReport({ orders }: YearlyReportProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const years = useMemo(() => {
    const list = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      list.push(i);
    }
    return list;
  }, [currentYear]);

  const stats = useMemo(() => {
    const targetYear = selectedYear;
    const yearOrders = orders.filter(o => parseISO(o.date).getFullYear() === targetYear);
    
    const revenue = yearOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    const websiteOrders = yearOrders.filter(o => o.source === 'Website');
    const facebookOrders = yearOrders.filter(o => o.source === 'Facebook');
    
    const websiteCount = websiteOrders.length;
    const facebookCount = facebookOrders.length;
    const websiteRev = websiteOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const facebookRev = facebookOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Month-by-month
    const months = eachMonthOfInterval({
      start: startOfYear(new Date(selectedYear, 0, 1)),
      end: endOfYear(new Date(selectedYear, 0, 1))
    });

    const monthData = months.map(month => {
      const mOrders = yearOrders.filter(o => parseISO(o.date).getMonth() === month.getMonth());
      return {
        name: format(month, 'MMMM'),
        count: mOrders.length,
        revenue: mOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      };
    });

    // Top Performers of the Year
    const personMap: Record<string, { count: number, rev: number }> = {};
    yearOrders.forEach(o => {
      if (!personMap[o.assignedPerson]) personMap[o.assignedPerson] = { count: 0, rev: 0 };
      personMap[o.assignedPerson].count++;
      personMap[o.assignedPerson].rev += o.totalAmount;
    });
    const topPerformers = Object.entries(personMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 5);

    return { total: yearOrders.length, revenue, websiteCount, facebookCount, websiteRev, facebookRev, monthData, topPerformers };
  }, [orders, selectedYear]);

  const chartData = {
    labels: stats.monthData.map(m => m.name),
    datasets: [{
      label: 'Monthly Revenue',
      data: stats.monthData.map(m => m.revenue),
      backgroundColor: '#2563EB',
      borderRadius: 4,
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Annual System Performance</h3>
          <p className="text-sm text-slate-500">Summary for Year {selectedYear}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Switch Year:</label>
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none font-bold"
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <YearStat label="Annual Orders" value={stats.total.toLocaleString()} />
          <YearStat label="Annual Revenue" value={formatCurrency(stats.revenue)} highlight />
          <YearStat label="Website Sales" value={`${stats.websiteCount} (${formatCurrency(stats.websiteRev)})`} />
          <YearStat label="Facebook Sales" value={`${stats.facebookCount} (${formatCurrency(stats.facebookRev)})`} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Revenue Growth Curve</h4>
          <div className="h-[300px]">
             <Bar 
               data={chartData} 
               options={{ 
                 responsive: true, 
                 maintainAspectRatio: false, 
                 scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } 
               }} 
             />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Breakdown</h4>
             </div>
             <table className="w-full text-left">
               <thead className="bg-white border-b border-slate-100">
                 <tr>
                    <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase">Month</th>
                    <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase text-right">Orders</th>
                    <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase text-right">Revenue</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-sm">
                 {stats.monthData.map(m => (
                   <tr key={m.name} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 font-medium text-slate-700">{m.name}</td>
                     <td className="px-6 py-3 text-right text-slate-500">{m.count}</td>
                     <td className="px-6 py-3 text-right font-bold text-slate-900">{formatCurrency(m.revenue)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Top Performers of {selectedYear}</h4>
             </div>
             <table className="w-full text-left">
               <thead className="bg-white border-b border-slate-100">
                 <tr>
                    <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase">Team Member</th>
                    <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase text-right">Orders</th>
                    <th className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase text-right">Total Contribution</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-sm">
                 {stats.topPerformers.map(p => (
                   <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 font-medium text-slate-700">{p.name}</td>
                     <td className="px-6 py-3 text-right text-slate-500">{p.count}</td>
                     <td className="px-6 py-3 text-right font-bold text-blue-600">{formatCurrency(p.rev)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
      </div>
    </div>
  );
}

function YearStat({ label, value, highlight }: any) {
  return (
    <div className={`p-6 rounded-xl border ${highlight ? 'bg-[#2563EB] text-white border-blue-600' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-blue-100' : 'text-gray-400'}`}>{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
