/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import OrderEntry from './components/OrderEntry';
import Reports from './components/Reports';
import DailyReport from './components/DailyReport';
import WeeklyReport from './components/WeeklyReport';
import MonthlyReport from './components/MonthlyReport';
import YearlyReport from './components/YearlyReport';
import Settings from './components/Settings';
import { View, Order, Product, TeamMember } from './types';
import { fetchIP } from './utils';
import { dataService } from './services/dataService';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    // Collect the current products to identify deletions
    const currentProducts = [...products];
    setProducts(updated);
    
    // Simple sync: upsert current list
    await dataService.syncProducts(updated);
    
    // Handle deletions (find what's in current but not in updated)
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

  const handleSetView = (view: View) => {
    setIsLoading(true);
    setCurrentView(view);
    setTimeout(() => setIsLoading(false), 400);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Syncing Igloo Order Management data...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'Dashboard':
        return <Dashboard orders={orders} />;
      case 'OrderEntry':
        return <OrderEntry products={products} members={members} onAddOrder={handleAddOrder} />;
      case 'Reports':
        return <Reports 
            orders={orders} 
            products={products} 
            members={members} 
            onUpdateOrder={handleUpdateOrder}
        />;
      case 'DailyReport':
        return <DailyReport orders={orders} />;
      case 'WeeklyReport':
        return <WeeklyReport orders={orders} />;
      case 'MonthlyReport':
        return <MonthlyReport orders={orders} />;
      case 'YearlyReport':
        return <YearlyReport orders={orders} />;
      case 'Settings':
        return <Settings 
          products={products} 
          members={members} 
          onUpdateProducts={handleUpdateProducts}
          onUpdateMembers={handleUpdateMembers}
        />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  const pageTitle = useMemo(() => {
    const items: Record<View, string> = {
      Dashboard: 'System Overview',
      OrderEntry: 'Create New Order',
      Reports: 'Full Order Archives',
      DailyReport: 'Daily Operational Audit',
      WeeklyReport: 'Weekly Performance Report',
      MonthlyReport: 'Monthly Analysis Report',
      YearlyReport: 'Yearly Performance Review',
      Settings: 'System Configuration',
    };
    return items[currentView];
  }, [currentView]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Header with Navigation */}
      <header className="h-14 bg-[#1E293B] text-white border-b border-slate-700 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center pr-4 border-r border-slate-700 h-10">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTsobmon4-n5hbXve4D3gt7ltmqYsdw7brTg&s" 
              alt="Logo" 
              className="h-9 w-auto object-contain rounded"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <nav className="flex items-center gap-1">
            {[
              { id: 'Dashboard', label: 'Dashboard' },
              { id: 'OrderEntry', label: 'Order Entry' },
              { id: 'Reports', label: 'Reports' },
              { id: 'DailyReport', label: 'Daily' },
              { id: 'WeeklyReport', label: 'Weekly' },
              { id: 'MonthlyReport', label: 'Monthly' },
              { id: 'YearlyReport', label: 'Yearly' },
              { id: 'Settings', label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleSetView(item.id as View)}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors text-xs font-bold uppercase tracking-wider",
                  currentView === item.id 
                    ? "bg-[#2563EB] text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 border-l border-slate-700 pl-4 h-8">
           <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date:</span>
                <span className="text-xs font-bold text-slate-300">{format(time, 'dd MMM yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Time:</span>
                <span className="text-xs font-black text-white tabular-nums">{format(time, 'hh:mm:ss a')}</span>
              </div>
           </div>
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
               key={currentView + isLoading}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
               {renderContent()}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
