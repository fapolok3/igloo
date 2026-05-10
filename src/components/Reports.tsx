/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Order, Product, TeamMember } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Search, Filter, Download, ArrowLeft, ArrowRight, XCircle, Trash2, Edit2, Check, X } from 'lucide-react';

interface ReportsProps {
  orders: Order[];
  products: Product[];
  members: TeamMember[];
  onUpdateOrder: (order: Order) => void;
}

export default function Reports({ orders, products, members, onUpdateOrder }: ReportsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editCache, setEditCache] = useState<Partial<Order>>({});

  const startEdit = (o: Order) => {
    setEditingOrderId(o.id);
    setEditCache({ ...o });
  };

  const saveEdit = () => {
    if (editingOrderId && editCache) {
      onUpdateOrder(editCache as Order);
      setEditingOrderId(null);
    }
  };
  const [filters, setFilters] = useState({
    product: 'All',
    assigned: 'All',
    source: 'All',
    fromDate: '',
    toDate: '',
    search: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchProduct = filters.product === 'All' || o.product === filters.product;
      const matchAssigned = filters.assigned === 'All' || o.assignedPerson === filters.assigned;
      const matchSource = filters.source === 'All' || o.source === filters.source;
      const matchFrom = !filters.fromDate || new Date(o.date) >= new Date(filters.fromDate);
      const matchTo = !filters.toDate || new Date(o.date) <= new Date(filters.toDate);
      
      const searchLower = filters.search.toLowerCase();
      const matchSearch = !filters.search || 
        o.clientName.toLowerCase().includes(searchLower) || 
        o.product.toLowerCase().includes(searchLower) || 
        (o.notes && o.notes.toLowerCase().includes(searchLower)) ||
        (o.phone && o.phone.includes(filters.search));
      
      return matchProduct && matchAssigned && matchSource && matchFrom && matchTo && matchSearch;
    });
  }, [orders, filters]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const totalSummary = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [filteredOrders]);

  const exportToCSV = () => {
    const headers = ['Date', 'Client', 'Phone', 'Source', 'Product', 'Qty', 'Unit Price', 'Total', 'Assigned', 'Notes'];
    const rows = filteredOrders.map(o => [
      o.date, o.clientName, o.phone, o.source, o.product, o.qty, o.unitPrice, o.totalAmount, o.assignedPerson, o.notes || ''
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `igloo_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setFilters({ product: 'All', assigned: 'All', source: 'All', fromDate: '', toDate: '', search: '' });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filter Toggle Bar */}
      <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ${showFilters ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Filter'}
            </button>

            {/* Advanced Search Input */}
            <div className="relative flex-1 md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                    type="text"
                    placeholder="Search Client, Product, or Notes..."
                    value={filters.search}
                    onChange={e => {
                        setFilters(f => ({ ...f, search: e.target.value }));
                        setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
            </div>
            
            {/* Rows per page */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows:</span>
                <select 
                    value={itemsPerPage}
                    onChange={e => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none hover:bg-slate-100 transition-colors"
                >
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                </select>
            </div>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right flex items-center gap-3">
                <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-tight">Total View:</span>
                <span className="text-sm font-black text-blue-600 tabular-nums">{formatCurrency(totalSummary)}</span>
            </div>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
         </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Product</label>
                <select 
                value={filters.product}
                onChange={e => { setFilters(f => ({ ...f, product: e.target.value })); setCurrentPage(1); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                >
                <option value="All">All Products</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Assigned</label>
                <select 
                value={filters.assigned}
                onChange={e => { setFilters(f => ({ ...f, assigned: e.target.value })); setCurrentPage(1); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                >
                <option value="All">All Members</option>
                {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Source</label>
                <select 
                value={filters.source}
                onChange={e => { setFilters(f => ({ ...f, source: e.target.value })); setCurrentPage(1); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                >
                <option value="All">All Sources</option>
                <option value="Website">Website</option>
                <option value="Facebook">Facebook</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">From Date</label>
                <input 
                type="date"
                value={filters.fromDate}
                onChange={e => { setFilters(f => ({ ...f, fromDate: e.target.value })); setCurrentPage(1); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">To Date</label>
                <input 
                type="date"
                value={filters.toDate}
                onChange={e => { setFilters(f => ({ ...f, toDate: e.target.value })); setCurrentPage(1); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                />
            </div>
            </div>
            <div className="flex justify-end pt-2">
                <button 
                onClick={clearFilters}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
                >
                <XCircle className="w-4 h-4" />
                Reset Filters
                </button>
            </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Qty</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.map(o => (
                <tr key={o.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {editingOrderId === o.id ? (
                        <input 
                            type="date"
                            className="bg-white border rounded px-1 py-0.5 text-xs font-bold"
                            value={editCache.date}
                            onChange={e => setEditCache({...editCache, date: e.target.value})}
                        />
                    ) : formatDate(o.date)}
                  </td>
                  <td className="px-4 py-4">
                    {editingOrderId === o.id ? (
                        <div className="space-y-1">
                            <input 
                                className="w-full bg-white border rounded px-1 py-0.5 text-xs font-bold"
                                value={editCache.clientName}
                                onChange={e => setEditCache({...editCache, clientName: e.target.value})}
                            />
                            <input 
                                className="w-full bg-white border rounded px-1 py-0.5 text-[10px]"
                                value={editCache.phone}
                                onChange={e => setEditCache({...editCache, phone: e.target.value})}
                            />
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-slate-800">{o.clientName}</p>
                            <p className="text-xs text-slate-400">{o.phone}</p>
                        </>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {editingOrderId === o.id ? (
                        <select 
                            className="bg-white border rounded px-1 py-0.5 text-[10px] font-bold"
                            value={editCache.source}
                            onChange={e => setEditCache({...editCache, source: e.target.value as any})}
                        >
                            <option value="Website">Website</option>
                            <option value="Facebook">Facebook</option>
                        </select>
                    ) : (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${o.source === 'Website' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                            {o.source}
                        </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {editingOrderId === o.id ? (
                        <select 
                            className="bg-white border rounded px-1 py-0.5 text-xs"
                            value={editCache.product}
                            onChange={e => setEditCache({...editCache, product: e.target.value})}
                        >
                            {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                    ) : o.product}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-800 font-medium text-center">
                    {editingOrderId === o.id ? (
                        <input 
                            type="number"
                            className="w-12 bg-white border rounded px-1 py-0.5 text-xs text-center"
                            value={editCache.qty}
                            onChange={e => {
                                const q = parseInt(e.target.value);
                                setEditCache({...editCache, qty: q, totalAmount: q * (editCache.unitPrice || 0)});
                            }}
                        />
                    ) : o.qty}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 text-right">
                    {editingOrderId === o.id ? (
                        <input 
                            type="number"
                            className="w-16 bg-white border rounded px-1 py-0.5 text-xs text-right"
                            value={editCache.unitPrice}
                            onChange={e => {
                                const p = parseFloat(e.target.value);
                                setEditCache({...editCache, unitPrice: p, totalAmount: p * (editCache.qty || 0)});
                            }}
                        />
                    ) : formatCurrency(o.unitPrice)}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">{formatCurrency(o.totalAmount)}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {o.assignedPerson}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                        {editingOrderId === o.id ? (
                            <>
                                <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setEditingOrderId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X className="w-3.5 h-3.5" /></button>
                            </>
                        ) : (
                            <button 
                                onClick={() => startEdit(o)} 
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                                title="Edit Order"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={6} className="px-4 py-4 text-right text-sm text-slate-500">Summary: {filteredOrders.length} Orders</td>
                <td className="px-4 py-4 text-right text-lg text-blue-600">{formatCurrency(totalSummary)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-white">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold">{(currentPage-1)*itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage*itemsPerPage, filteredOrders.length)}</span> of <span className="font-bold">{filteredOrders.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => Math.max(1, c-1))}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold px-4">Page {currentPage} of {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(c => Math.min(totalPages, c+1))}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
