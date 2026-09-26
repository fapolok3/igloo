/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  IceCream,
  MessageSquare,
  PlusSquare, 
  FileText, 
  Calendar,
  CalendarDays, 
  CalendarRange, 
  BarChart3,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sub-tree items under Reports
export const reportSubItems = [
  { id: 'daily', label: 'Daily Report', path: '/daily', icon: Calendar },
  { id: 'weekly', label: 'Weekly Report', path: '/weekly', icon: CalendarDays },
  { id: 'monthly', label: 'Monthly Report', path: '/monthly', icon: CalendarRange },
  { id: 'yearly', label: 'Yearly Report', path: '/yearly', icon: BarChart3 },
];

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Sidebar({ isExpanded, onToggle, onClose }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current route is within Reports or its sub-tree
  const isReportsActive = currentPath === '/reports' || reportSubItems.some(sub => sub.path === currentPath);
  
  // Keep reports sub-tree open if user is viewing any report, or allow toggle
  const [isReportsExpanded, setIsReportsExpanded] = useState<boolean>(true);

  // Automatically expand reports sub-tree whenever navigating to a report route
  useEffect(() => {
    if (isReportsActive) {
      setIsReportsExpanded(true);
    }
  }, [currentPath, isReportsActive]);

  // Helper to close on mobile click
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop when expanded on small screens */}
      {isExpanded && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Sidebar Container: 
          Switches between w-60 (expanded) and w-[64px] / md:w-[72px] (icon rail)
      */}
      <aside className={cn(
        "bg-[#1E293B] text-white min-h-screen flex flex-col fixed left-0 top-0 z-40 border-r border-slate-800 transition-all duration-300 ease-in-out shadow-xl",
        isExpanded ? "w-60 translate-x-0" : "w-[64px] md:w-[72px] translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className={cn(
          "h-14 border-b border-slate-800 flex items-center px-3.5 transition-all",
          isExpanded ? "justify-between" : "justify-center"
        )}>
          {isExpanded ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTsobmon4-n5hbXve4D3gt7ltmqYsdw7brTg&s" 
                  alt="Igloo Logo" 
                  className="h-8 w-auto object-contain rounded bg-white p-0.5 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h1 className="text-sm font-black tracking-tight leading-none text-white truncate">IGLOO</h1>
                  <span className="text-[9px] font-bold text-blue-400 tracking-wider uppercase truncate block mt-0.5">Order Management</span>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition flex items-center justify-center flex-shrink-0 cursor-pointer"
                aria-label="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={onToggle}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
              aria-label="Toggle Sidebar"
              title="Expand Sidebar"
            >
              <Menu className="w-5 h-5 text-blue-400" />
            </button>
          )}
        </div>
        
        {/* Navigation Modules List */}
        <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {/* 1. Dashboard */}
          <Link
            to="/dashboard"
            onClick={handleNavClick}
            title={!isExpanded ? "Dashboard" : undefined}
            className={cn(
              "flex items-center rounded-xl transition-all relative group",
              isExpanded ? "gap-3 px-3.5 py-2.5 text-xs font-semibold tracking-wide" : "justify-center p-3",
              currentPath === '/dashboard' || currentPath === '/'
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/40" 
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            )}
          >
            <LayoutDashboard className={cn("w-5 h-5 flex-shrink-0", currentPath === '/dashboard' || currentPath === '/' ? "text-white" : "text-slate-400")} />
            {isExpanded ? (
              <span>Dashboard</span>
            ) : (
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                Dashboard
              </span>
            )}
          </Link>

          {/* 2. Product List */}
          <Link
            to="/product-list"
            onClick={handleNavClick}
            title={!isExpanded ? "Product List" : undefined}
            className={cn(
              "flex items-center rounded-xl transition-all relative group",
              isExpanded ? "gap-3 px-3.5 py-2.5 text-xs font-semibold tracking-wide" : "justify-center p-3",
              currentPath === '/product-list'
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/40" 
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            )}
          >
            <IceCream className={cn("w-5 h-5 flex-shrink-0", currentPath === '/product-list' ? "text-white" : "text-slate-400")} />
            {isExpanded ? (
              <span>Product List</span>
            ) : (
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                Product List
              </span>
            )}
          </Link>

          {/* 3. FB Reply KB */}
          <Link
            to="/knowledge-base"
            onClick={handleNavClick}
            title={!isExpanded ? "FB Reply KB" : undefined}
            className={cn(
              "flex items-center rounded-xl transition-all relative group",
              isExpanded ? "gap-3 px-3.5 py-2.5 text-xs font-semibold tracking-wide" : "justify-center p-3",
              currentPath === '/knowledge-base'
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/40" 
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            )}
          >
            <MessageSquare className={cn("w-5 h-5 flex-shrink-0", currentPath === '/knowledge-base' ? "text-white" : "text-slate-400")} />
            {isExpanded ? (
              <span>FB Reply KB</span>
            ) : (
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                FB Reply KB
              </span>
            )}
          </Link>

          {/* 4. Order Entry */}
          <Link
            to="/order-entry"
            onClick={handleNavClick}
            title={!isExpanded ? "Order Entry" : undefined}
            className={cn(
              "flex items-center rounded-xl transition-all relative group",
              isExpanded ? "gap-3 px-3.5 py-2.5 text-xs font-semibold tracking-wide" : "justify-center p-3",
              currentPath === '/order-entry'
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/40" 
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            )}
          >
            <PlusSquare className={cn("w-5 h-5 flex-shrink-0", currentPath === '/order-entry' ? "text-white" : "text-slate-400")} />
            {isExpanded ? (
              <span>Order Entry</span>
            ) : (
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                Order Entry
              </span>
            )}
          </Link>

          {/* 5. Reports (with Sub-Tree) */}
          {isExpanded ? (
            <div className="pt-1">
              {/* Reports Parent Header Row */}
              <div className={cn(
                "w-full flex items-center justify-between rounded-xl transition-all text-xs font-semibold tracking-wide group",
                currentPath === '/reports'
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/40"
                  : isReportsActive
                    ? "bg-slate-800 text-blue-300"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              )}>
                {/* Link to Main Reports page */}
                <Link
                  to="/reports"
                  onClick={() => {
                    setIsReportsExpanded(true);
                    handleNavClick();
                  }}
                  className="flex-1 flex items-center gap-3 px-3.5 py-2.5 min-w-0"
                >
                  <FileText className={cn("w-5 h-5 flex-shrink-0", currentPath === '/reports' ? "text-white" : isReportsActive ? "text-blue-400" : "text-slate-400")} />
                  <span className="truncate">Reports</span>
                </Link>

                {/* Sub-Tree Toggle Chevron */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsReportsExpanded(!isReportsExpanded);
                  }}
                  className="p-2.5 hover:bg-white/10 rounded-r-xl transition flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                  title={isReportsExpanded ? "Collapse Reports" : "Expand Reports"}
                  aria-label="Toggle Reports sub-tree"
                >
                  {isReportsExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
                  )}
                </button>
              </div>

              {/* Reports Sub-Tree Items */}
              {isReportsExpanded && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-700/70 space-y-1 transition-all">
                  {reportSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = currentPath === sub.path;
                    return (
                      <Link
                        key={sub.id}
                        to={sub.path}
                        onClick={handleNavClick}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs font-medium tracking-wide",
                          isSubActive
                            ? "bg-blue-600 text-white font-bold shadow-sm"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                        )}
                      >
                        <SubIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isSubActive ? "text-white" : "text-slate-400")} />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Collapsed/Mini Mode: Clean icons for Reports and Sub-Reports */
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              {/* Main Reports icon */}
              <Link
                to="/reports"
                onClick={handleNavClick}
                className={cn(
                  "flex items-center justify-center p-3 rounded-xl transition-all relative group",
                  currentPath === '/reports'
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/40"
                    : isReportsActive
                      ? "bg-slate-800 text-blue-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                  Reports Overview
                </span>
              </Link>

              {/* Sub-report icons */}
              {reportSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = currentPath === sub.path;
                return (
                  <Link
                    key={sub.id}
                    to={sub.path}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center justify-center p-2.5 rounded-xl transition-all relative group",
                      isSubActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                    )}
                  >
                    <SubIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                      {sub.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 6. Settings */}
          <div className="pt-1">
            <Link
              to="/settings"
              onClick={handleNavClick}
              title={!isExpanded ? "Settings" : undefined}
              className={cn(
                "flex items-center rounded-xl transition-all relative group",
                isExpanded ? "gap-3 px-3.5 py-2.5 text-xs font-semibold tracking-wide" : "justify-center p-3",
                currentPath === '/settings'
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/40" 
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              )}
            >
              <SettingsIcon className={cn("w-5 h-5 flex-shrink-0", currentPath === '/settings' ? "text-white" : "text-slate-400")} />
              {isExpanded ? (
                <span>Settings</span>
              ) : (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                  Settings
                </span>
              )}
            </Link>
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        {isExpanded && (
          <div className="p-3 border-t border-slate-800/80 text-[10px] text-slate-400 text-center font-medium">
            Igloo Operations v2.0
          </div>
        )}
      </aside>
    </>
  );
}
