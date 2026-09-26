/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Tag, 
  Gift, 
  ShoppingCart, 
  CheckCircle2, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { dataService } from '../services/dataService';

interface ProductListProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export default function ProductList({ products, onUpdateProducts }: ProductListProps) {
  const navigate = useNavigate();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync with igloobd.com
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await dataService.syncFromIgloobd(products);
      onUpdateProducts(res.products);
      setSyncFeedback({
        type: 'success',
        message: `https://igloobd.com/ থেকে সফলভাবে ${res.totalCount}টি প্রোডাক্ট ও অফার সিঙ্ক হয়েছে! (${res.addedCount}টি নতুন যুক্ত, ${res.updatedCount}টির দাম/তথ্য আপডেট হয়েছে)`
      });
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: `সিঙ্ক নোটিশ: ${err?.message || 'লাইভ সিঙ্ক সম্পন্ন করতে সমস্যা হয়েছে'}`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Offer products list
  const offerProducts = useMemo(() => {
    return products.filter(p => p.isOffer || (p.name && p.name.toUpperCase().includes('FREE')) || (p.offerText && p.offerText.length > 0));
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.offerText && p.offerText.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Only offers filter
    if (onlyOffers) {
      result = result.filter(p => p.isOffer || (p.name && p.name.toUpperCase().includes('FREE')) || p.offerText);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchQuery, selectedCategory, onlyOffers, sortBy]);

  // Handle Quick Order
  const handleQuickOrder = (productName: string) => {
    try {
      sessionStorage.setItem('igloo_quick_order_product', productName);
    } catch (e) {}
    navigate('/order-entry');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Sync Button Only */}
      <div className="flex justify-end items-center">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-sm hover:shadow-blue-500/25 disabled:opacity-50"
          title="Sync latest products and prices from igloobd.com"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Catalog'}
        </button>
      </div>

      {/* Sync feedback notification */}
      {syncFeedback && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
          syncFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {syncFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
          <span>{syncFeedback.message}</span>
        </div>
      )}

      {/* SPECIAL OFFERS SHOWCASE (অফার প্রোডাক্টসমূহ) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Special Offer Products (অফার প্রোডাক্টসমূহ)
                <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {offerProducts.length} Active Deals
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ফ্রি গ্লাস বাটি, ডিসকাউন্ট এবং কম্বো অফার সংবলিত প্রিমিয়াম আইসক্রিম
              </p>
            </div>
          </div>
          <button
            onClick={() => setOnlyOffers(!onlyOffers)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto ${
              onlyOffers 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{onlyOffers ? 'Show All Products' : 'Filter Offers Only'}</span>
          </button>
        </div>

        {/* Offers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {offerProducts.map((p) => (
            <div 
              key={`offer_${p.id}`}
              className="bg-gradient-to-b from-rose-50/40 via-white to-white dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/60 p-4 flex flex-col justify-between hover:shadow-md hover:border-rose-400 dark:hover:border-rose-700 transition-all duration-200 relative group"
            >
              {/* Offer Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  {p.offerText || 'Special Offer'}
                </span>
              </div>

              {/* Product Image */}
              <div className="w-full h-44 bg-slate-50 dark:bg-slate-800/80 rounded-lg p-2 flex items-center justify-center overflow-hidden mb-3 relative">
                <img 
                  src={p.image || "https://igloobd.com/default/assets/img/logo/logo.png"} 
                  alt={p.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e: any) => {
                    e.target.src = "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                    {p.category || 'Special Offer'}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2" title={p.name}>
                    {p.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-slate-900 dark:text-white">৳{p.price.toLocaleString()}</span>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="text-xs text-slate-400 line-through">৳{p.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Official Price</span>
                  </div>

                  <button
                    onClick={() => handleQuickOrder(p.name)}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95 shadow-sm"
                    title="Order this offer product"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, category, or offer (e.g. Ambrosia, Mango, Liter, Free)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters: Sort & Offers Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                onlyOffers
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Offers Only</span>
            </button>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Categories:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ALL PRODUCTS GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>All Products Catalog</span>
            <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-semibold">
              Showing {filteredProducts.length} of {products.length}
            </span>
          </h2>
          {(searchQuery || selectedCategory !== 'all' || onlyOffers) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyOffers(false);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">No products found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              কোনো প্রোডাক্টের নাম বা ফিল্টারের সাথে মিল পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const isOfferItem = p.isOffer || (p.name && p.name.toUpperCase().includes('FREE')) || p.offerText;

              return (
                <div 
                  key={p.id}
                  className={`bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden group ${
                    isOfferItem ? 'border-rose-200 dark:border-rose-900/60 ring-1 ring-rose-100 dark:ring-rose-950/40' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Top Image area */}
                  <div className="w-full h-48 bg-slate-50 dark:bg-slate-800/80 relative p-4 flex items-center justify-center overflow-hidden">
                    {isOfferItem && (
                      <span className="absolute top-2.5 left-2.5 z-10 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        {p.offerText || 'Offer'}
                      </span>
                    )}

                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2.5 right-2.5 z-10 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-blue-600 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View product details on igloobd.com"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <img 
                      src={p.image || "https://igloobd.com/default/assets/img/logo/logo.png"} 
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80";
                      }}
                    />
                  </div>

                  {/* Details Area */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {p.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {p.category}
                        </span>
                      )}
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2" title={p.name}>
                        {p.name}
                      </h3>
                      {p.offerText && (
                        <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                          <Gift className="w-3 h-3 flex-shrink-0" />
                          <span>{p.offerText}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-slate-900 dark:text-white">৳{p.price.toLocaleString()}</span>
                          {p.oldPrice && p.oldPrice > p.price && (
                            <span className="text-xs text-slate-400 line-through">৳{p.oldPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">Official Price</span>
                      </div>

                      <button
                        onClick={() => handleQuickOrder(p.name)}
                        className="bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm border border-transparent dark:border-slate-700"
                        title="Create an order with this product"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
