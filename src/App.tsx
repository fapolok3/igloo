/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OrderEntry from './components/OrderEntry';
import Reports from './components/Reports';
import DailyReport from './components/DailyReport';
import WeeklyReport from './components/WeeklyReport';
import MonthlyReport from './components/MonthlyReport';
import YearlyReport from './components/YearlyReport';
import Settings from './components/Settings';
import ProductList from './components/ProductList';
import CustomerSupportKB from './components/CustomerSupportKB';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sidebar Open / Closed state with local storage persistence
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('igloo_sidebar_open');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true; // Default open on desktop
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      try {
        localStorage.setItem('igloo_sidebar_open', String(next));
      } catch (e) {}
      return next;
    });
  };

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
        
        setOrders(ordersData || []);
        setProducts(productsData || []);
        setMembers(membersData || []);
      } catch (error) {
        console.warn('Notice loading data, using local cache:', error);
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
    { id: 'product-list', label: 'Product List', path: '/product-list' },
    { id: 'knowledge-base', label: 'FB Reply KB', path: '/knowledge-base' },
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
      '/product-list': 'Official Product Catalog & Offers',
      '/knowledge-base': 'Facebook Customer Reply Knowledge Base',
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Syncing Igloo Order Management data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#0b0f19] font-sans text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar with all Modules */}
      <Sidebar 
        isExpanded={isSidebarOpen} 
        onToggle={toggleSidebar} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-h-screen flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "pl-60" : "pl-[64px] md:pl-[72px]"
      )}>
        {/* Page Title Bar */}
        <div className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-slate-800 px-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-gray-800 dark:text-slate-100 uppercase tracking-widest truncate">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-slate-400 hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Igloo Management Portal</span>
            </div>
            <ThemeToggle variant="header" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 flex-1">
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
                  <Route path="/product-list" element={<ProductList products={products} onUpdateProducts={handleUpdateProducts} />} />
                  <Route path="/knowledge-base" element={<CustomerSupportKB />} />
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
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

