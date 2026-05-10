/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  PlusSquare, 
  FileText, 
  CalendarDays, 
  CalendarRange, 
  Settings as SettingsIcon,
  IceCream
} from 'lucide-react';
import { View } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

export default function Sidebar({ currentView, setView }: SidebarProps) {
  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'OrderEntry', icon: PlusSquare, label: 'Order Entry' },
    { id: 'Reports', icon: FileText, label: 'Reports' },
    { id: 'WeeklyReport', icon: CalendarDays, label: 'Weekly Report' },
    { id: 'MonthlyReport', icon: CalendarRange, label: 'Monthly Report' },
    { id: 'Settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <aside className="w-[220px] bg-[#1E293B] text-white min-h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <span className="text-2xl" role="img" aria-label="ice cream">🧊</span>
        <h1 className="text-xl font-bold tracking-tight">IGLOO</h1>
      </div>
      
      <nav className="flex-1 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 transition-colors text-sm font-medium",
              currentView === item.id 
                ? "bg-[#2563EB] text-white" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-white" : "text-slate-400")} />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-700 text-[10px] uppercase tracking-widest text-slate-500 text-center">
        Powered by Igloo ERP v1.0
      </div>
    </aside>
  );
}
