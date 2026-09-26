/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Tag, 
  HelpCircle, 
  DollarSign, 
  CheckCircle2, 
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { 
  KNOWLEDGE_BASE_ITEMS, 
  OFFICIAL_PRICE_LIST, 
  FAQItem 
} from '../data/knowledgeBaseData';
import { dataService } from '../services/dataService';
import { getSupabaseClient } from '../lib/supabase';

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General FAQs' },
  { value: 'comments', label: 'FB Comments' },
  { value: 'mango_layers', label: 'Mango Layers' },
  { value: 'mango_fusion', label: 'Mango Fusion' },
  { value: 'zero', label: 'Zero Sugar-Conscious' },
  { value: 'escalation', label: 'Escalation Policy' },
  { value: 'delivery', label: 'Delivery & Area' },
  { value: 'offers', label: 'Offers & Promotions' },
  { value: 'custom', label: 'Custom Category' },
];

export const SUPABASE_KB_SQL = `-- ==============================================================================
-- 1. Create table for FB Customer Reply Knowledge Base (kb_items)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.kb_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'general',
    categoryLabel TEXT NOT NULL DEFAULT 'General FAQs',
    topic TEXT NOT NULL,
    question TEXT,
    englishReply TEXT NOT NULL,
    banglaReply TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    isCustom BOOLEAN DEFAULT true,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. Enable Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.kb_items ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. Public Read/Write Access Policy (Allowing Anon Key to Read & Write)
-- ==============================================================================
DO $$ BEGIN
    CREATE POLICY "Public Read/Write Access" ON public.kb_items FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 4. Fast Query Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_kb_items_category ON public.kb_items(category);
CREATE INDEX IF NOT EXISTS idx_kb_items_topic ON public.kb_items(topic);
CREATE INDEX IF NOT EXISTS idx_kb_items_createdAt ON public.kb_items(createdAt DESC);
`;

export default function CustomerSupportKB() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>(KNOWLEDGE_BASE_ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewLanguage, setViewLanguage] = useState<'both' | 'bangla' | 'english'>('both');
  const [priceSearchQuery, setPriceSearchQuery] = useState('');
  const [selectedPriceCategory, setSelectedPriceCategory] = useState<string>('all');

  // Copy status tracker
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Forms
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);

  // Form Fields
  const [formTopic, setFormTopic] = useState('');
  const [formCategory, setFormCategory] = useState('general');
  const [formCustomCategoryLabel, setFormCustomCategoryLabel] = useState('');
  const [formQuestion, setFormQuestion] = useState('');
  const [formBanglaReply, setFormBanglaReply] = useState('');
  const [formEnglishReply, setFormEnglishReply] = useState('');
  const [formTags, setFormTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation tracker (id -> boolean)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  // Load KB Items from dataService (Supabase + localStorage merge)
  const loadItems = async () => {
    setIsLoading(true);
    try {
      const items = await dataService.getKBItems();
      setFaqItems(items);
      setIsSupabaseConnected(Boolean(getSupabaseClient()));
    } catch (err) {
      console.warn('Failed to load KB items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Sync KB from Supabase / Local storage with notification
  const handleSyncKB = async () => {
    setIsLoading(true);
    try {
      const items = await dataService.getKBItems();
      setFaqItems(items);
      setIsSupabaseConnected(Boolean(getSupabaseClient()));
      showToast(`সফলভাবে ${items.length}টি নলেজবেস টেমপ্লেট সিঙ্ক হয়েছে!`);
    } catch (err) {
      console.warn('Failed to sync KB items:', err);
      showToast('সিঙ্ক সম্পন্ন করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helper
  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      showToast(`কপি হয়েছে: ${label}`);
      setTimeout(() => {
        setCopiedKey(prev => (prev === key ? null : prev));
      }, 2500);
    } catch (err) {
      console.warn('Failed to copy text:', err);
    }
  };

  // Open Form for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTopic('');
    setFormCategory('general');
    setFormCustomCategoryLabel('');
    setFormQuestion('');
    setFormBanglaReply('');
    setFormEnglishReply('');
    setFormTags('');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (item: FAQItem) => {
    setEditingItem(item);
    setFormTopic(item.topic);
    setFormCategory(item.category);
    setFormCustomCategoryLabel(item.categoryLabel);
    setFormQuestion(item.question || '');
    setFormBanglaReply(item.banglaReply || '');
    setFormEnglishReply(item.englishReply || '');
    setFormTags(item.tags ? item.tags.join(', ') : '');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Handle Form Submit
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) {
      setFormError('Please enter a topic or title');
      return;
    }
    if (!formBanglaReply.trim() && !formEnglishReply.trim()) {
      setFormError('Please enter Bangla or English reply');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const selectedCatObj = CATEGORY_OPTIONS.find(c => c.value === formCategory);
      const categoryLabel = formCategory === 'custom' 
        ? (formCustomCategoryLabel.trim() || 'Custom Category')
        : (selectedCatObj?.label || 'General FAQs');

      const parsedTags = formTags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

      const bReply = formBanglaReply.trim() || formEnglishReply.trim();
      const eReply = formEnglishReply.trim() || formBanglaReply.trim();

      if (editingItem) {
        // Update existing item
        const updatedItem: FAQItem = {
          ...editingItem,
          topic: formTopic.trim(),
          category: formCategory,
          categoryLabel,
          question: formQuestion.trim() || undefined,
          banglaReply: bReply,
          englishReply: eReply,
          tags: parsedTags,
          isCustom: true,
        };
        await dataService.updateKBItem(updatedItem);
        setFaqItems(prev => prev.map(it => it.id === updatedItem.id ? updatedItem : it));
        showToast(`"${updatedItem.topic}" updated successfully!`);
      } else {
        // Add new item
        const newItem = await dataService.addKBItem({
          topic: formTopic.trim(),
          category: formCategory,
          categoryLabel,
          question: formQuestion.trim() || undefined,
          banglaReply: bReply,
          englishReply: eReply,
          tags: parsedTags,
          isCustom: true,
        });
        setFaqItems(prev => [newItem, ...prev]);
        showToast(`"${newItem.topic}" added successfully!`);
      }

      setIsFormModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save reply');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete item handler
  const handleDeleteItem = async (id: string, topic: string) => {
    try {
      await dataService.deleteKBItem(id);
      setFaqItems(prev => prev.filter(it => it.id !== id));
      setConfirmDeleteId(null);
      showToast(`"${topic}" সফলভাবে মুছে ফেলা হয়েছে`);
    } catch (err) {
      console.warn('Failed to delete KB item:', err);
    }
  };

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    let list = [...faqItems];

    if (selectedCategory !== 'all' && selectedCategory !== 'price_list') {
      list = list.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.topic.toLowerCase().includes(q) ||
        (item.question && item.question.toLowerCase().includes(q)) ||
        item.englishReply.toLowerCase().includes(q) ||
        item.banglaReply.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [faqItems, searchQuery, selectedCategory]);

  // Categories list with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: faqItems.length,
      general: 0,
      comments: 0,
      mango_layers: 0,
      mango_fusion: 0,
      zero: 0,
      escalation: 0,
      price_list: OFFICIAL_PRICE_LIST.length
    };
    faqItems.forEach(it => {
      counts[it.category] = (counts[it.category] || 0) + 1;
    });
    return counts;
  }, [faqItems]);

  // Filtered Price List
  const filteredPriceList = useMemo(() => {
    let list = [...OFFICIAL_PRICE_LIST];
    if (selectedPriceCategory !== 'all') {
      list = list.filter(p => p.category === selectedPriceCategory);
    }
    if (priceSearchQuery.trim()) {
      const q = priceSearchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.product.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.pricePerPcs.toString().includes(q)
      );
    }
    return list;
  }, [priceSearchQuery, selectedPriceCategory]);

  const priceCategories = useMemo(() => {
    const set = new Set<string>();
    OFFICIAL_PRICE_LIST.forEach(p => set.add(p.category));
    return Array.from(set);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar: Only Add New Reply & Sync Button */}
      <div className="flex justify-end items-center gap-3">
        <button
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm hover:shadow-emerald-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Reply</span>
        </button>

        <button
          onClick={handleSyncKB}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-sm hover:shadow-blue-500/25 disabled:opacity-50"
          title="Sync Knowledge Base with Supabase & Local Cache"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Syncing...' : 'Sync KB'}</span>
        </button>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          All FAQs ({categoryCounts.all})
        </button>

        <button
          onClick={() => setSelectedCategory('general')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === 'general'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          General FAQs ({categoryCounts.general})
        </button>

        <button
          onClick={() => setSelectedCategory('comments')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === 'comments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          FB Comments ({categoryCounts.comments})
        </button>

        <button
          onClick={() => setSelectedCategory('mango_layers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === 'mango_layers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          Mango Layers ({categoryCounts.mango_layers})
        </button>

        <button
          onClick={() => setSelectedCategory('mango_fusion')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === 'mango_fusion'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          Mango Fusion ({categoryCounts.mango_fusion})
        </button>

        <button
          onClick={() => setSelectedCategory('zero')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === 'zero'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
          Zero Sugar-Conscious ({categoryCounts.zero})
        </button>

        <button
          onClick={() => setSelectedCategory('price_list')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === 'price_list'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-green-500" />
          Price List ({categoryCounts.price_list})
        </button>

        <button
          onClick={() => setSelectedCategory('escalation')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === 'escalation'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          Escalation Policy ({categoryCounts.escalation})
        </button>
      </div>

      {/* PRICE LIST VIEW */}
      {selectedCategory === 'price_list' ? (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Igloo Official Price List (আপডেটেড মূল্য তালিকা)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                যেকোনো প্রোডাক্টের দাম কাস্টমারকে পাঠানোর জন্য এক ক্লিকে "Copy Info" চাপুন
              </p>
            </div>

            {/* Price Search & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search product name..."
                  value={priceSearchQuery}
                  onChange={(e) => setPriceSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none w-56 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedPriceCategory}
                onChange={(e) => setSelectedPriceCategory(e.target.value)}
                className="text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="all">All Categories</option>
                {priceCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Table */}
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">Price / Pcs</th>
                  <th className="px-4 py-3">Price / Carton</th>
                  <th className="px-4 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredPriceList.map((item) => {
                  const copyKey = `price_${item.id}`;
                  const isCopied = copiedKey === copyKey;
                  const copyText = `Igloo ${item.product} (${item.volume}${item.unit}): ৳${item.pricePerPcs}/pcs, ৳${item.pricePerCarton}/carton`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] border border-transparent dark:border-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">
                        {item.product}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {item.volume} {item.unit}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">
                        ৳{item.pricePerPcs}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">
                        ৳{item.pricePerCarton}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => handleCopy(copyText, copyKey, item.product)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm active:scale-95 ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-700'
                          }`}
                          title="Copy product & price info"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied!' : 'Copy Info'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* FAQS KNOWLEDGE BASE VIEW */
        <div className="space-y-6">
          {/* Search & Language Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs by topic, keywords (e.g. stock, delivery, freezer, mango, coupon)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg text-xs font-bold border border-transparent dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 px-2">Show:</span>
              <button
                onClick={() => setViewLanguage('both')}
                className={`px-3 py-1.5 rounded-md transition ${
                  viewLanguage === 'both' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Both (বাংলা + English)
              </button>
              <button
                onClick={() => setViewLanguage('bangla')}
                className={`px-3 py-1.5 rounded-md transition ${
                  viewLanguage === 'bangla' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🇧🇩 Bangla Only
              </button>
              <button
                onClick={() => setViewLanguage('english')}
                className={`px-3 py-1.5 rounded-md transition ${
                  viewLanguage === 'english' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🇬🇧 English Only
              </button>
            </div>
          </div>

          {/* Results Counter & Add New Quick Button */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <div className="flex items-center gap-2">
              <span>Showing {filteredFAQs.length} reply templates</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  (Clear Search)
                </button>
              )}
            </div>
            <button
              onClick={handleOpenCreate}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Template</span>
            </button>
          </div>

          {/* FAQ Cards List */}
          {filteredFAQs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">কোনো উত্তর পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি। নতুন উত্তর যোগ করতে উপরের "+ Add New Reply" বাটনে ক্লিক করুন।
              </p>
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-500 transition"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন রিপ্লাই তৈরি করুন</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredFAQs.map((faq) => {
                const banglaKey = `bn_${faq.id}`;
                const englishKey = `en_${faq.id}`;
                const isBanglaCopied = copiedKey === banglaKey;
                const isEnglishCopied = copiedKey === englishKey;
                const isDeleting = confirmDeleteId === faq.id;

                return (
                  <div 
                    key={faq.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden transition-all space-y-0 ${
                      faq.isCustom 
                        ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-50 dark:ring-emerald-950/40' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="bg-slate-50/90 dark:bg-slate-800/60 px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${faq.isCustom ? 'bg-emerald-500' : 'bg-blue-600'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                              {faq.categoryLabel}
                            </span>
                            {faq.isCustom && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/50">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                Custom Entry
                              </span>
                            )}
                          </div>
                          <h3 className="font-black text-slate-900 dark:text-white text-sm md:text-base mt-0.5">
                            {faq.topic}
                          </h3>
                        </div>
                      </div>

                      {/* Header Actions: Edit, Delete, Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Tags */}
                        {faq.tags && faq.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-medium border border-transparent dark:border-slate-700">
                            #{tag}
                          </span>
                        ))}

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(faq)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Edit this entry"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button with inline confirmation */}
                        {isDeleting ? (
                          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1 rounded-lg border border-rose-200 dark:border-rose-900">
                            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 px-1">মুছে ফেলবেন?</span>
                            <button
                              onClick={() => handleDeleteItem(faq.id, faq.topic)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(faq.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Delete this entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Context if any with 1-click Copy Question Button */}
                    {faq.question && (
                      <div className="px-6 py-2.5 bg-blue-50/80 dark:bg-blue-950/50 border-b border-blue-100 dark:border-blue-900/50 text-xs text-blue-950 dark:text-blue-200 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                          <span className="font-semibold text-blue-950 dark:text-blue-200">গ্রাহকের প্রশ্ন বা প্রসঙ্গ: {faq.question}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(faq.question!, `q_${faq.id}`, `Question: ${faq.topic}`)}
                          className="text-[11px] text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 font-bold flex items-center gap-1 bg-white dark:bg-slate-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 shadow-xs transition active:scale-95"
                          title="Copy question text"
                        >
                          {copiedKey === `q_${faq.id}` ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `q_${faq.id}` ? 'Copied!' : 'Copy Question'}</span>
                        </button>
                      </div>
                    )}

                    {/* Replies Body (Split or Single) */}
                    <div className={`p-6 grid gap-6 ${
                      viewLanguage === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
                    }`}>
                      {/* Bangla Reply Box */}
                      {(viewLanguage === 'both' || viewLanguage === 'bangla') && (
                        <div className="flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/80 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs relative group">
                          <div>
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <span>🇧🇩</span>
                                <span>বাংলা উত্তর (Bangla Reply)</span>
                              </span>
                              <button
                                onClick={() => handleCopy(faq.banglaReply, banglaKey, `${faq.topic} (বাংলা)`)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                                  isBanglaCopied
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:border-emerald-800'
                                }`}
                              >
                                {isBanglaCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isBanglaCopied ? 'কপি হয়েছে!' : 'Copy Bangla'}</span>
                              </button>
                            </div>

                            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-medium">
                              {faq.banglaReply}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400">
                            <span>Ready to paste in Messenger / Comment</span>
                            <button
                              onClick={() => handleCopy(faq.banglaReply, banglaKey, `${faq.topic} (বাংলা)`)}
                              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>কপি করুন</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* English Reply Box */}
                      {(viewLanguage === 'both' || viewLanguage === 'english') && (
                        <div className="flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/80 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs relative group">
                          <div>
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <span>🇬🇧</span>
                                <span>English Reply</span>
                              </span>
                              <button
                                onClick={() => handleCopy(faq.englishReply, englishKey, `${faq.topic} (English)`)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                                  isEnglishCopied
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-800'
                                }`}
                              >
                                {isEnglishCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isEnglishCopied ? 'Copied!' : 'Copy English'}</span>
                              </button>
                            </div>

                            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-normal">
                              {faq.englishReply}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400">
                            <span>Approved English Support Script</span>
                            <button
                              onClick={() => handleCopy(faq.englishReply, englishKey, `${faq.topic} (English)`)}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy Script</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT KB ENTRY */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingItem ? 'Edit Reply Template' : 'Add New Reply Template'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEntry} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Topic / Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Topic / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Topic name"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Category Label if selected */}
              {formCategory === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Custom category name"
                    value={formCustomCategoryLabel}
                    onChange={(e) => setFormCustomCategoryLabel(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Question / Customer Query */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Query (Optional)
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Customer query or question"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Bangla Reply */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  🇧🇩 Bangla Reply (বাংলায় উত্তর)
                </label>
                <textarea
                  rows={4}
                  autoComplete="off"
                  placeholder="বাংলায় উত্তর লিখুন..."
                  value={formBanglaReply}
                  onChange={(e) => setFormBanglaReply(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* English Reply */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  🇬🇧 English Reply (ইংরেজি উত্তর)
                </label>
                <textarea
                  rows={4}
                  autoComplete="off"
                  placeholder="Enter English reply..."
                  value={formEnglishReply}
                  onChange={(e) => setFormEnglishReply(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Comma separated tags"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isSaving ? 'Saving...' : (editingItem ? 'Update Reply' : 'Save Reply')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
