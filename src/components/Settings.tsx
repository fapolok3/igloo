/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Product, TeamMember } from '../types';
import { 
  Plus, 
  Trash2, 
  Users, 
  IceCream, 
  AlertTriangle,
  Edit2,
  Check, 
  X,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Search,
  Globe,
  Moon
} from 'lucide-react';
import { formatCurrency } from '../utils';
import { dataService } from '../services/dataService';
import ThemeToggle from './ThemeToggle';

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

  // igloobd.com Sync State
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [productFilter, setProductFilter] = useState('');

  const filteredProducts = useMemo(() => {
    if (!productFilter.trim()) return products;
    const q = productFilter.toLowerCase().trim();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.price.toString().includes(q));
  }, [products, productFilter]);

  const handleSyncWithIgloo = async () => {
    setIsSyncingProducts(true);
    setSyncStatus(null);
    try {
      const res = await dataService.syncFromIgloobd(products);
      onUpdateProducts(res.products);
      setSyncStatus({
        type: 'success',
        message: `Successfully synchronized products & prices from https://igloobd.com/! Total: ${res.totalCount} products (${res.addedCount} new added, ${res.updatedCount} prices refreshed). Previous orders remain unchanged.`
      });
    } catch (err: any) {
      setSyncStatus({
        type: 'error',
        message: `Sync notice: ${err?.message || 'Unable to complete sync'}.`
      });
    } finally {
      setIsSyncingProducts(false);
    }
  };

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
    <div className="space-y-8">
      {/* Theme & Display Mode */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Appearance & Night-Time Work
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Switch between Light Mode and Dark Mode for high visibility during late-night shift work. Preference is saved automatically in your browser.
            </p>
          </div>
          <div className="sm:w-80">
            <ThemeToggle variant="settings" />
          </div>
        </div>
      </div>

      {/* Top 2 columns: Products & Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <IceCream className="w-5 h-5" />
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    Manage Products
                    <span className="text-xs bg-blue-500/80 text-blue-100 px-2 py-0.5 rounded-full font-medium">
                      {products.length}
                    </span>
                  </h2>
                </div>
              </div>

              {/* Sync from igloobd.com button */}
              <button
                type="button"
                onClick={handleSyncWithIgloo}
                disabled={isSyncingProducts}
                className="bg-white text-blue-700 hover:bg-blue-50 active:scale-95 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-sm disabled:opacity-50"
                title="Sync products and prices from https://igloobd.com/"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingProducts ? 'animate-spin' : ''}`} />
                {isSyncingProducts ? 'Syncing with igloobd.com...' : 'Sync from igloobd.com'}
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Sync Status Feedback */}
              {syncStatus && (
                <div className={`p-3 rounded-lg text-xs flex items-start justify-between gap-2 ${
                  syncStatus.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium">{syncStatus.message}</span>
                  </div>
                  <button 
                    onClick={() => setSyncStatus(null)} 
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Official Store Badge & Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-lg text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>Official Catalog: <strong>igloobd.com</strong></span>
                </div>
                <a
                  href="https://igloobd.com/products"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                >
                  Visit igloobd.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Add New Product Form */}
              <form onSubmit={addProduct} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg flex flex-col sm:flex-row gap-3 border border-slate-200/60 dark:border-slate-800">
                <input 
                  type="text"
                  placeholder="New Product Name"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  required
                />
                <input 
                  type="number"
                  placeholder="Price (৳)"
                  className="w-28 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  value={newProduct.price}
                  onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                  required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              {/* Product Search & Filter Bar */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search product name or price (e.g. Cone, Chocbar, 1 Liter)..."
                    value={productFilter}
                    onChange={e => setProductFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 font-medium"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  {productFilter && (
                    <button 
                      onClick={() => setProductFilter('')} 
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {filteredProducts.length} of {products.length} products
                </span>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto max-h-96 border border-slate-100 dark:border-slate-800 rounded-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-left sticky top-0 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Name</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-xs text-slate-400">
                          No products found matching "{productFilter}"
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                            {editingProductId === p.id ? (
                                <input 
                                    className="w-full px-2 py-1 border border-blue-300 dark:border-blue-700 rounded text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    value={editProductCache.name}
                                    onChange={e => setEditProductCache(prev => ({ ...prev, name: e.target.value }))}
                                />
                            ) : (
                              <div className="flex items-center gap-3">
                                {p.image ? (
                                  <img 
                                    src={p.image} 
                                    alt={p.name} 
                                    className="w-9 h-9 object-contain rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 flex-shrink-0"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">
                                    🍦
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <span className="block truncate font-semibold text-slate-900 dark:text-white">{p.name}</span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {p.category && (
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-medium border border-transparent dark:border-slate-700">
                                        {p.category}
                                      </span>
                                    )}
                                    {p.offerText && (
                                      <span className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-1.5 py-0.2 rounded font-bold">
                                        {p.offerText}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {editingProductId === p.id ? (
                                <input 
                                    type="number"
                                    className="w-20 px-2 py-1 border border-blue-300 dark:border-blue-700 rounded text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    value={editProductCache.price}
                                    onChange={e => setEditProductCache(prev => ({ ...prev, price: e.target.value }))}
                                />
                            ) : formatCurrency(p.price)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                                {editingProductId === p.id ? (
                                    <>
                                        <button onClick={() => saveProductEdit(p.id)} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-slate-800 rounded" title="Save"><Check className="w-4 h-4" /></button>
                                        <button onClick={() => setEditingProductId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Cancel"><X className="w-4 h-4" /></button>
                                    </>
                                ) : deletingProductId === p.id ? (
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => deleteProduct(p.id)} 
                                            className="bg-red-600 text-white text-[10px] font-black italic uppercase px-2 py-1 rounded shadow-sm hover:bg-red-700"
                                        >
                                            DEL?
                                        </button>
                                        <button onClick={() => setDeletingProductId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs px-2">Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <button onClick={() => startEditProduct(p)} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setDeletingProductId(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                    </>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Order Safety Notice */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Historical Order Protection:</strong> Synchronizing products from igloobd.com or updating catalog prices only affects new orders. Existing and previous order records, quantities, unit prices, and revenue statistics remain 100% intact.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex items-center gap-3 text-white">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-bold">Team Members</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <form onSubmit={addMember} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg flex gap-3 border border-slate-200/60 dark:border-slate-800">
                <input 
                  type="text"
                  placeholder="Member Name"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  value={newMember.name}
                  onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                  required
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              <div className="overflow-x-auto max-h-96 border border-slate-100 dark:border-slate-800 rounded-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-left sticky top-0 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {members.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                           {editingMemberId === m.id ? (
                              <input 
                                  className="w-full px-2 py-1 border border-indigo-300 dark:border-indigo-700 rounded text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                  value={editMemberCache.name}
                                  onChange={e => setEditMemberCache(prev => ({ ...prev, name: e.target.value }))}
                              />
                          ) : m.name}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                               {editingMemberId === m.id ? (
                                  <>
                                      <button onClick={() => saveMemberEdit(m.id)} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-slate-800 rounded" title="Save"><Check className="w-4 h-4" /></button>
                                      <button onClick={() => setEditingMemberId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Cancel"><X className="w-4 h-4" /></button>
                                  </>
                              ) : deletingMemberId === m.id ? (
                                  <div className="flex items-center gap-1">
                                      <button 
                                          onClick={() => deleteMember(m.id)} 
                                          className="bg-red-600 text-white text-[10px] font-black italic uppercase px-2 py-1 rounded shadow-sm hover:bg-red-700"
                                      >
                                          DEL?
                                      </button>
                                      <button onClick={() => setDeletingMemberId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs px-2">Cancel</button>
                                  </div>
                              ) : (
                                  <>
                                      <button onClick={() => startEditMember(m)} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                      <button onClick={() => setDeletingMemberId(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
               Modifying products or members will update options for new orders. Historical order records remain intact.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
