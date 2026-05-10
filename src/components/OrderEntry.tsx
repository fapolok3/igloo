/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, TeamMember, Order, OrderSource } from '../types';
import { format } from 'date-fns';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

interface OrderEntryProps {
  products: Product[];
  members: TeamMember[];
  onAddOrder: (order: Order) => void;
}

export default function OrderEntry({ products, members, onAddOrder }: OrderEntryProps) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    clientName: '',
    phone: '',
    source: 'Website' as OrderSource,
    product: '',
    qty: 1,
    unitPrice: 0,
    assignedPerson: '',
    notes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (members.length > 0 && !formData.assignedPerson) {
      setFormData(prev => ({ ...prev, assignedPerson: members[0].name }));
    }
  }, [members]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productName = e.target.value;
    const selectedProduct = products.find(p => p.name === productName);
    setFormData(prev => ({
      ...prev,
      product: productName,
      unitPrice: selectedProduct ? selectedProduct.price : 0
    }));
  };

  const totalAmount = formData.qty * formData.unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.phone || !formData.product || !formData.assignedPerson) {
      alert('Please fill in all required fields');
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      totalAmount,
      createdAt: new Date().toISOString()
    };

    onAddOrder(newOrder);
    
    // Feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      clientName: '',
      phone: '',
      source: 'Website',
      product: '',
      qty: 1,
      unitPrice: 0,
      assignedPerson: members[0]?.name || '',
      notes: ''
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#1E293B] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-white w-5 h-5" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">New Order Entry</h2>
          </div>
          {showSuccess && (
            <div className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <CheckCircle2 className="w-3 h-3" />
              SAVED SUCCESSFULLY
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Order Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Client Name</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.clientName}
                onChange={e => setFormData(p => ({ ...p, clientName: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Phone Number</label>
              <input
                type="text"
                required
                placeholder="01xxxxxxxxx"
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Sales Source</label>
              <select
                value={formData.source}
                onChange={e => setFormData(p => ({ ...p, source: e.target.value as OrderSource }))}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Website">Website Store</option>
                <option value="Facebook">Facebook Page</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Select Product</label>
              <select
                required
                value={formData.product}
                onChange={handleProductChange}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="">-- Choose Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Assigned Person</label>
              <select
                required
                value={formData.assignedPerson}
                onChange={e => setFormData(p => ({ ...p, assignedPerson: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="">-- Select Member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Qty</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.qty}
                  onChange={e => setFormData(p => ({ ...p, qty: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none text-center font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Unit Price</label>
                <input
                  type="number"
                  required
                  value={formData.unitPrice}
                  onChange={e => setFormData(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none text-right font-medium"
                />
              </div>
            </div>

            <div className="md:col-span-1 p-3 bg-blue-50 rounded-lg border border-blue-100 flex flex-col justify-center">
              <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 text-center">Grand Total</label>
              <div className="text-xl font-black text-blue-700 text-center">
                ৳{totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Order Notes</label>
              <input
                type="text"
                placeholder="Notes..."
                value={formData.notes}
                onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-10 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded shadow-md transition-all active:scale-95"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
