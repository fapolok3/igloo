/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OrderEntry from './components/OrderEntry';
import Reports from './components/Reports';
import DailyReport from './components/DailyReport';
import WeeklyReport from './components/WeeklyReport';
import MonthlyReport from './components/MonthlyReport';
import YearlyReport from './components/YearlyReport';
import Settings from './components/Settings';
import { Order, Product, TeamMember } from './types';
import { fetchIP } from './utils';
import { dataService } from './services/dataService';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, productsData, membersData] = await Promise.all([
          dataService.getOrders(),
          dataService.getProducts(),
          dataService.getMembers()
        ]);
        
        setOrders(ordersData);
        setProducts(productsData);
        setMembers(membersData);
      } catch (error) {
        console.error('Failed to load data from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleAddOrder = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    await dataService.addOrder(order);
  };

  const handleUpdateOrder = async (order: Order) => {
    setOrders(prev => prev.map(o => o.id === order.id ? order : o));
    await dataService.updateOrder(order);
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    await dataService.deleteOrder(orderId);
  };

  const handleUpdateProducts = async (updated: Product[]) => {
    const currentProducts = [...products];
    setProducts(updated);
    await dataService.syncProducts(updated);
    const deletedIds = currentProducts
      .filter(p => !updated.find(u => u.id === p.id))
      .map(p => p.id);
    for (const id of deletedIds) {
      await dataService.deleteProduct(id);
    }
  };

  const handleUpdateMembers = async (updated: TeamMember[]) => {
    const currentMembers = [...members];
    setMembers(updated);
    await dataService.syncMembers(updated);
    const deletedIds = currentMembers
      .filter(m => !updated.find(u => u.id === m.id))
      .map(m => m.id);
    for (const id of deletedIds) {
      await dataService.deleteMember(id);
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'order-entry', label: 'Order Entry', path: '/order-entry' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'daily', label: 'Daily', path: '/daily' },
    { id: 'weekly', label: 'Weekly', path: '/weekly' },
    { id: 'monthly', label: 'Monthly', path: '/monthly' },
    { id: 'yearly', label: 'Yearly', path: '/yearly' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ];

  const currentPath = location.pathname;

  const pageTitle = useMemo(() => {
    const activeItem = navigation.find(item => item.path === currentPath);
    if (!activeItem) return 'Igloo Order Management';

    const titles: Record<string, string> = {
      '/dashboard': 'System Overview',
      '/order-entry': 'Create New Order',
      '/reports': 'Full Order Archives',
      '/daily': 'Daily Operational Audit',
      '/weekly': 'Weekly Performance Report',
      '/monthly': 'Monthly Analysis Report',
      '/yearly': 'Yearly Performance Review',
      '/settings': 'System Configuration',
    };
    return titles[currentPath] || 'Operational Control Panel';
  }, [currentPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Syncing Igloo Order Management data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Header with Navigation */}
      <header className="h-14 bg-[#1E293B] text-white border-b border-slate-700 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center pr-4 border-r border-slate-700 h-10 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTsobmon4-n5hbXve4D3gt7ltmqYsdw7brTg&s" 
              alt="Logo" 
              className="h-9 w-auto object-contain rounded"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <nav className="flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors text-xs font-bold uppercase tracking-wider",
                  currentPath === item.path 
                    ? "bg-[#2563EB] text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      
      <main className="min-h-screen flex flex-col min-w-0">
        {/* Page Title Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">{pageTitle}</h2>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentPath}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
               <Routes>
                  <Route path="/dashboard" element={<Dashboard orders={orders} />} />
                  <Route path="/order-entry" element={<OrderEntry products={products} members={members} onAddOrder={handleAddOrder} />} />
                  <Route path="/reports" element={<Reports orders={orders} products={products} members={members} onUpdateOrder={handleUpdateOrder} />} />
                  <Route path="/daily" element={<DailyReport orders={orders} />} />
                  <Route path="/weekly" element={<WeeklyReport orders={orders} />} />
                  <Route path="/monthly" element={<MonthlyReport orders={orders} />} />
                  <Route path="/yearly" element={<YearlyReport orders={orders} />} />
                  <Route path="/settings" element={<Settings 
                    products={products} 
                    members={members} 
                    onUpdateProducts={handleUpdateProducts}
                    onUpdateMembers={handleUpdateMembers}
                  />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
               </Routes>
             </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

