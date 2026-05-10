/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  parseISO,
  eachWeekOfInterval,
  isWithinInterval,
  endOfWeek,
  startOfWeek
} from 'date-fns';
import { formatCurrency } from '../utils';
import { Line } from 'react-chartjs-2';

interface MonthlyReportProps {
  orders: Order[];
}

export default function MonthlyReport({ orders }: MonthlyReportProps) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(now, 'yyyy-MM'));
  
  const monthRange = useMemo(() => {
    const d = parseISO(`${selectedMonth}-01`);
    return { start: startOfMonth(d), end: endOfMonth(d) };
  }, [selectedMonth]);

  const stats = useMemo(() => {
    const monthOrders = orders.filter(o => isSameMonth(parseISO(o.date), monthRange.start));
    
    const revenue = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const count = monthOrders.length;
    
    const websiteOrders = monthOrders.filter(o => o.source === 'Website');
    const facebookOrders = monthOrders.filter(o => o.source === 'Facebook');
    
    const websiteCount = websiteOrders.length;
    const facebookCount = facebookOrders.length;
    const websiteRev = websiteOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const facebookRev = facebookOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgDaily = monthOrders.length / (eachDayOfInterval(monthRange).length);

    // Week-by-week
    const weeksInMonth = eachWeekOfInterval(monthRange, { weekStartsOn: 1 });
    const weekData = weeksInMonth.map((weekStart, idx) => {
      const wEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekOrders = monthOrders.filter(o => {
        const d = parseISO(o.date);
        return d >= weekStart && d <= wEnd;
      });
      return {
        label: `Week ${idx + 1}`,
        range: `${format(weekStart, 'dd')} - ${format(wEnd, 'dd MMM')}`,
        count: weekOrders.length,
        revenue: weekOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      };
    });

    // Daily Trend
    const days = eachDayOfInterval(monthRange);
    const dailyTrend = days.map(day => ({
      day: format(day, 'dd'),
      count: monthOrders.filter(o => format(parseISO(o.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length
    }));

    // Product performance
    const productMap: Record<string, { qty: number, rev: number }> = {};
    monthOrders.forEach(o => {
      if (!productMap[o.product]) productMap[o.product] = { qty: 0, rev: 0 };
      productMap[o.product].qty += o.qty;
      productMap[o.product].rev += o.totalAmount;
    });
    const products = Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data, percent: revenue > 0 ? (data.rev / revenue) * 100 : 0 }))
      .sort((a, b) => b.rev - a.rev);

    // Top Persons
    const personMap: Record<string, { count: number, rev: number }> = {};
    monthOrders.forEach(o => {
      if (!personMap[o.assignedPerson]) personMap[o.assignedPerson] = { count: 0, rev: 0 };
      personMap[o.assignedPerson].count++;
      personMap[o.assignedPerson].rev += o.totalAmount;
    });
    const persons = Object.entries(personMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 5);

    return { total: monthOrders.length, revenue, websiteCount, facebookCount, websiteRev, facebookRev, avgDaily, weekData, dailyTrend, products, persons };
  }, [orders, monthRange]);

  const lineChartData = {
    labels: stats.dailyTrend.map(d => d.day),
    datasets: [{
      label: 'Orders',
      data: stats.dailyTrend.map(d => d.count),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Monthly Analysis</h3>
          <p className="text-sm text-slate-500">{format(monthRange.start, 'MMMM yyyy')}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Select Month:</label>
          <input 
            type="month"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatMini label="Monthly Orders" value={stats.total} />
        <StatMini label="Total Revenue" value={formatCurrency(stats.revenue)} />
        <StatMini label="Website" value={`${stats.websiteCount} (${formatCurrency(stats.websiteRev)})`} />
        <StatMini label="Facebook" value={`${stats.facebookCount} (${formatCurrency(stats.facebookRev)})`} />
        <StatMini label="Avg Daily" value={stats.avgDaily.toFixed(1)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6">Daily Orders Trend</h4>
          <div className="h-[250px]">
             <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100">
             <h4 className="font-bold text-slate-800">Week-by-Week Breakdown</h4>
           </div>
           <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Week</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Orders</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.weekData.map(w => (
                    <tr key={w.label}>
                       <td className="px-4 py-3">
                         <p className="text-sm font-bold text-slate-800">{w.label}</p>
                         <p className="text-[10px] text-slate-400">{w.range}</p>
                       </td>
                       <td className="px-4 py-3 text-sm text-slate-600 text-right">{w.count}</td>
                       <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">{formatCurrency(w.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="px-6 py-4 border-b border-slate-100">
             <h4 className="font-bold text-slate-800">Product Performance</h4>
           </div>
           <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Qty</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Revenue</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.products.map(p => (
                    <tr key={p.name}>
                       <td className="px-4 py-3 text-sm text-slate-700">{p.name}</td>
                       <td className="px-4 py-3 text-sm text-slate-600 text-right">{p.qty}</td>
                       <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">{formatCurrency(p.rev)}</td>
                       <td className="px-4 py-3 text-[10px] font-bold text-blue-600 text-right">{p.percent.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="px-6 py-4 border-b border-slate-100">
             <h4 className="font-bold text-slate-800">Top Assigned Persons</h4>
           </div>
           <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Orders</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.persons.map(p => (
                    <tr key={p.name}>
                       <td className="px-4 py-3 text-sm text-slate-700">{p.name}</td>
                       <td className="px-4 py-3 text-sm text-slate-600 text-right">{p.count}</td>
                       <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">{formatCurrency(p.rev)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200">
       <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</p>
       <p className="text-xl font-black text-slate-800">{value}</p>
    </div>
  );
}
