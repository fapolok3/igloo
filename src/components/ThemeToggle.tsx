/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ThemeToggleProps {
  variant?: 'header' | 'sidebar' | 'sidebar-collapsed' | 'settings';
  className?: string;
}

export default function ThemeToggle({ variant = 'header', className }: ThemeToggleProps) {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  if (variant === 'settings') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
            !isDark 
              ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-300" 
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
          )}
        >
          <Sun className={cn("w-4 h-4", !isDark ? "text-amber-500" : "text-slate-400")} />
          <span>Light Mode (দিন)</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
            isDark 
              ? "bg-slate-900 border-blue-500 text-white shadow-sm ring-1 ring-blue-500" 
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
          )}
        >
          <Moon className={cn("w-4 h-4", isDark ? "text-blue-400" : "text-slate-400")} />
          <span>Dark Mode (রাত / Night Work)</span>
        </button>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 cursor-pointer",
          className
        )}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode (Night Work)"}
        aria-label="Toggle Night Mode"
      >
        <div className="flex items-center gap-2.5">
          {isDark ? (
            <Moon className="w-4 h-4 text-blue-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
          <span>{isDark ? 'Night Mode' : 'Light Mode'}</span>
        </div>
        <div className={cn(
          "w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out",
          isDark ? "bg-blue-600" : "bg-slate-600"
        )}>
          <div className={cn(
            "w-3 h-3 rounded-full bg-white transition-transform duration-200 ease-in-out",
            isDark ? "translate-x-4" : "translate-x-0"
          )} />
        </div>
      </button>
    );
  }

  if (variant === 'sidebar-collapsed') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "flex items-center justify-center p-2.5 rounded-xl transition-all relative group text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer",
          className
        )}
        title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
        aria-label="Toggle Night Mode"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-blue-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400" />
        )}
        <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
          {isDark ? 'Switch to Light' : 'Night Mode'}
        </span>
      </button>
    );
  }

  // Header variant (default)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-xl border transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs",
        isDark
          ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700/80 hover:text-amber-300"
          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode (Night Work)"}
      aria-label="Toggle Light/Dark Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" />
      )}
      <span className="text-xs font-bold hidden md:inline">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
