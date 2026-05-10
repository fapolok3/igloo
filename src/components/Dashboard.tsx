/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { format, startOfMonth, endOfMonth, isSameDay, isWithinInterval, startOfYear, endOfYear, subDays } from 'date-fns';
import { TrendingUp, TrendingDown, ShoppingBag, Globe, Facebook, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  orders: Order[];
}

export default function Dashboard({ orders }: DashboardProps) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(now, 'MM'));
  const [selectedYear, setSelectedYear] = useState(format(now, 'yyyy'));
  
  const years = useMemo(() => {
    const currentYear = parseInt(format(now, 'yyyy'));
    const list = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
        list.push(i.toString());
    }
    return list;
  }, [now]);

  const monthStart = useMemo(() => startOfMonth(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1)), [selectedMonth, selectedYear]);
  const monthEnd = useMemo(() => endOfMonth(monthStart), [monthStart]);
  const yearStart = useMemo(() => startOfYear(monthStart), [monthStart]);
  
  const stats = useMemo(() => {
    const currentMonthOrders = orders.filter(o => {
      const d = new Date(o.date);
      return d >= monthStart && d <= monthEnd;
    });

    const websiteOrders = currentMonthOrders.filter(o => o.source === 'Website');
    const facebookOrders = currentMonthOrders.filter(o => o.source === 'Facebook');
    
    const todayOrders = orders.filter(o => isSameDay(new Date(o.date), now));
    const yearOrders = orders.filter(o => new Date(o.date) >= yearStart && new Date(o.date) <= endOfYear(monthStart));

    return {
      total: { count: currentMonthOrders.length, amount: currentMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0) },
      website: { count: websiteOrders.length, amount: websiteOrders.reduce((sum, o) => sum + o.totalAmount, 0) },
      facebook: { count: facebookOrders.length, amount: facebookOrders.reduce((sum, o) => sum + o.totalAmount, 0) },
      today: { count: todayOrders.length, amount: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0) },
      monthRevenue: currentMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      yearTotal: { count: yearOrders.length, amount: yearOrders.reduce((sum, o) => sum + o.totalAmount, 0) }
    };
  }, [orders, monthStart, monthEnd, yearStart, now]);

  // Comparison stats
  const comparison = useMemo(() => {
    const today = now;
    const yesterday = subDays(now, 1);
    
    const todayData = orders.filter(o => isSameDay(new Date(o.date), today));
    const yesterdayData = orders.filter(o => isSameDay(new Date(o.date), yesterday));
    
    const tCount = todayData.length;
    const yCount = yesterdayData.length;
    const countDiff = yCount === 0 ? (tCount > 0 ? 100 : 0) : ((tCount - yCount) / yCount) * 100;

    return {
      yesterday: { count: yCount, amount: yesterdayData.reduce((sum, o) => sum + o.totalAmount, 0) },
      today: { count: tCount, amount: todayData.reduce((sum, o) => sum + o.totalAmount, 0) },
      countDiff
    };
  }, [orders, now]);

  const yearChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);

    orders.filter(o => new Date(o.date).getFullYear() === parseInt(selectedYear)).forEach(o => {
      const m = new Date(o.date).getMonth();
      counts[m]++;
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Total Orders',
          data: counts,
          backgroundColor: (context: any) => {
            const index = context.dataIndex;
            const currentMonthIdx = parseInt(selectedMonth) - 1;
            return index === currentMonthIdx ? '#2563EB' : '#F1F5F9';
          },
          borderRadius: 4,
        }
      ]
    };
  }, [orders, selectedYear, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Month/Year Selectors */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Report Period:</label>
            <div className="flex items-center gap-1">
                <select 
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                >
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
                        <option key={m} value={m}>{format(new Date(2024, parseInt(m)-1, 1), 'MMMM')}</option>
                    ))}
                </select>
                <select 
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                >
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Filtered by: {format(monthStart, 'MMMM yyyy')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard title="Total Orders" count={stats.total.count.toLocaleString()} amount={formatCurrency(stats.total.amount)} color="blue" />
        <KpiCard title="Website" count={stats.website.count.toLocaleString()} amount={formatCurrency(stats.website.amount)} />
        <KpiCard title="Facebook" count={stats.facebook.count.toLocaleString()} amount={formatCurrency(stats.facebook.amount)} />
        <KpiCard title="Today" count={stats.today.count.toLocaleString()} amount={formatCurrency(stats.today.amount)} highlight />
        <KpiCard title="Month Rev." count={formatCurrency(stats.monthRevenue)} amount="+12% vs last mo" amountColor="text-green-500" />
        <KpiCard title="Annual" count={stats.yearTotal.count.toLocaleString()} amount={`${formatCurrency(stats.yearTotal.amount)} total`} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Yesterday vs Today */}
        <div className="col-span-12 xl:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full">
          <h3 className="text-xs font-bold text-gray-700 mb-6 uppercase tracking-widest">Yesterday vs Today</h3>
          <div className="flex justify-between items-end gap-4 h-40 px-4">
            <div className="flex-1 flex flex-col items-center">
              <div 
                className="w-12 bg-slate-100 rounded-t-lg transition-all duration-500" 
                style={{ height: `${Math.max(10, Math.min(100, (comparison.yesterday.count / Math.max(comparison.today.count, comparison.yesterday.count || 1)) * 100))}%` }}
              ></div>
              <p className="text-xs mt-2 font-bold text-slate-500">Yesterday</p>
              <p className="text-[10px] text-slate-400">{comparison.yesterday.count} orders</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div 
                className="w-12 bg-blue-500 rounded-t-lg transition-all duration-500" 
                style={{ height: `${Math.max(10, Math.min(100, (comparison.today.count / Math.max(comparison.today.count, comparison.yesterday.count || 1)) * 100))}%` }}
              ></div>
              <p className="text-xs mt-2 font-bold text-blue-600">Today</p>
              <p className="text-[10px] text-blue-400">{comparison.today.count} orders</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Variance</p>
              <p className={`text-sm font-bold ${comparison.countDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparison.countDiff >= 0 ? '▲' : '▼'} {Math.abs(Math.round(comparison.countDiff))}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Revenue Gap</p>
              <p className="text-sm font-bold text-gray-800">
                {comparison.today.amount >= comparison.yesterday.amount ? '+' : '-'} {formatCurrency(Math.abs(comparison.today.amount - comparison.yesterday.amount))}
              </p>
            </div>
          </div>
        </div>

        {/* Year Overview */}
        <div className="col-span-12 xl:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Annual Performance {now.getFullYear()}</h3>
            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase">Jan - Dec</span>
          </div>
          <div className="h-40">
            <Bar 
              data={yearChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: { display: false },
                  x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#94a3b8' } }
                },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-[9px] text-blue-600 font-bold uppercase tracking-tight">Current Performance</p>
              <p className="text-sm font-bold text-blue-900">{formatCurrency(stats.monthRevenue)} (This Mo)</p>
            </div>
            <div className="bg-emerald-50 p-2 rounded-lg">
              <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-tight">Today Status</p>
              <p className="text-sm font-bold text-emerald-900">{stats.today.count} Orders</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Avg Mo. Rev</p>
              <p className="text-sm font-bold text-slate-900">{formatCurrency(stats.yearTotal.amount / (now.getMonth() + 1))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, count, amount, highlight, amountColor }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>{count}</p>
      <p className={`text-[10px] ${amountColor || 'text-gray-500'} font-medium mt-1`}>{amount}</p>
    </div>
  );
}
