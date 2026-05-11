/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, TeamMember } from '../types';
import { 
  Plus, 
  Trash2, 
  Users, 
  IceCream, 
  AlertTriangle,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { formatCurrency } from '../utils';

interface SettingsProps {
  products: Product[];
  members: TeamMember[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateMembers: (members: TeamMember[]) => void;
}

export default function Settings({ products, members, onUpdateProducts, onUpdateMembers }: SettingsProps) {
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [newMember, setNewMember] = useState({ name: '' });
  
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProductCache, setEditProductCache] = useState({ name: '', price: '' });

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editMemberCache, setEditMemberCache] = useState({ name: '' });

  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditProductCache({ name: p.name, price: p.price.toString() });
  };

  const saveProductEdit = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, name: editProductCache.name, price: parseFloat(editProductCache.price) } : p);
    onUpdateProducts(updated);
    setEditingProductId(null);
  };

  const startEditMember = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setEditMemberCache({ name: m.name });
  };

  const saveMemberEdit = (id: string) => {
    const updated = members.map(m => m.id === id ? { ...m, name: editMemberCache.name } : m);
    onUpdateMembers(updated);
    setEditingMemberId(null);
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const p: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: parseFloat(newProduct.price)
    };
    onUpdateProducts([...products, p]);
    setNewProduct({ name: '', price: '' });
  };

  const deleteProduct = (id: string) => {
    onUpdateProducts(products.filter(p => p.id !== id));
    setDeletingProductId(null);
  };

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;
    const m: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name
    };
    onUpdateMembers([...members, m]);
    setNewMember({ name: '' });
  };

  const deleteMember = (id: string) => {
    onUpdateMembers(members.filter(m => m.id !== id));
    setDeletingMemberId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Products Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex items-center gap-3 text-white">
            <IceCream className="w-5 h-5" />
            <h2 className="text-lg font-bold">Manage Products</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <form onSubmit={addProduct} className="bg-slate-50 p-4 rounded-lg flex flex-col sm:flex-row gap-3">
              <input 
                type="text"
                placeholder="Product Name"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                value={newProduct.name}
                onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                required
              />
              <input 
                type="number"
                placeholder="Price"
                className="w-24 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                value={newProduct.price}
                onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                required
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {editingProductId === p.id ? (
                            <input 
                                className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                                value={editProductCache.name}
                                onChange={e => setEditProductCache(prev => ({ ...prev, name: e.target.value }))}
                            />
                        ) : p.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {editingProductId === p.id ? (
                            <input 
                                type="number"
                                className="w-20 px-2 py-1 border border-blue-300 rounded text-sm"
                                value={editProductCache.price}
                                onChange={e => setEditProductCache(prev => ({ ...prev, price: e.target.value }))}
                            />
                        ) : formatCurrency(p.price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                            {editingProductId === p.id ? (
                                <>
                                    <button onClick={() => saveProductEdit(p.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingProductId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"><X className="w-4 h-4" /></button>
                                </>
                            ) : deletingProductId === p.id ? (
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => deleteProduct(p.id)} 
                                        className="bg-red-600 text-white text-[10px] font-black italic uppercase px-2 py-1 rounded shadow-sm hover:bg-red-700 shine-effect"
                                    >
                                        DEL?
                                    </button>
                                    <button onClick={() => setDeletingProductId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded text-xs px-2">Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => startEditProduct(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => setDeletingProductId(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                </>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4 flex items-center gap-3 text-white">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-bold">Team Members</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <form onSubmit={addMember} className="bg-slate-50 p-4 rounded-lg flex gap-3">
              <input 
                type="text"
                placeholder="Member Name"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                value={newMember.name}
                onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                required
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700">
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                         {editingMemberId === m.id ? (
                            <input 
                                className="w-full px-2 py-1 border border-indigo-300 rounded text-sm"
                                value={editMemberCache.name}
                                onChange={e => setEditMemberCache(prev => ({ ...prev, name: e.target.value }))}
                            />
                        ) : m.name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                             {editingMemberId === m.id ? (
                                <>
                                    <button onClick={() => saveMemberEdit(m.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingMemberId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"><X className="w-4 h-4" /></button>
                                </>
                            ) : deletingMemberId === m.id ? (
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => deleteMember(m.id)} 
                                        className="bg-red-600 text-white text-[10px] font-black italic uppercase px-2 py-1 rounded shadow-sm hover:bg-red-700"
                                    >
                                        DEL?
                                    </button>
                                    <button onClick={() => setDeletingMemberId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded text-xs px-2">Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => startEditMember(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => setDeletingMemberId(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                </>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
           <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />
           <p className="text-xs text-amber-700 leading-relaxed">
             Deleting a product or member will not affect historical order data but they will be removed from new selection dropdowns. Actions are permanent.
           </p>
        </div>

      </div>
    </div>
  );
}
