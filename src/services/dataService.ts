/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseClient } from '../lib/supabase';
import { Order, Product, TeamMember } from '../types';
import { getIglooProductsAsAppProducts, IGLOO_OFFICIAL_CATALOG } from '../data/iglooCatalog';
import { FAQItem, KNOWLEDGE_BASE_ITEMS } from '../data/knowledgeBaseData';

const STORAGE_KEYS = {
  ORDERS: 'igloo_orders_v2',
  PRODUCTS: 'igloo_products_v2',
  MEMBERS: 'igloo_members_v2',
  KB_ITEMS: 'igloo_kb_items_v2',
};

export const DEFAULT_PRODUCTS: Product[] = getIglooProductsAsAppProducts();

export const DEFAULT_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Tanvir Ahmed' },
  { id: 'm2', name: 'Farhana Rahman' },
  { id: 'm3', name: 'Rafiqul Islam' },
  { id: 'm4', name: 'Sadia Akter' },
  { id: 'm5', name: 'Nusrat Jahan' },
];

const DUMMY_SAMPLE_ORDER_IDS = new Set([
  'ord_101', 'ord_102', 'ord_103', 'ord_104', 'ord_105', 'ord_106', 'ord_107', 'ord_108'
]);

// Safe local storage helpers
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    // Ignore quota or private browsing errors
  }
}

// Timeout wrapper converting PromiseLike into Promise so UI never hangs
function withTimeout<T>(promiseLike: PromiseLike<T>, timeoutMs = 3500): Promise<T> {
  return Promise.race([
    Promise.resolve(promiseLike),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out')), timeoutMs)
    )
  ]);
}

export const dataService = {
  // Orders
  getOrders: async (): Promise<Order[]> => {
    // Purge any dummy demo orders previously saved in localStorage
    let localOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const filteredOrders = localOrders.filter(o => !DUMMY_SAMPLE_ORDER_IDS.has(o.id));
    if (filteredOrders.length !== localOrders.length) {
      localOrders = filteredOrders;
      setLocal(STORAGE_KEYS.ORDERS, localOrders);
    }

    const client = getSupabaseClient();
    if (!client) {
      return localOrders;
    }

    try {
      const response = await withTimeout(
        client.from('orders').select('*').order('createdAt', { ascending: false })
      );

      if (response.error) {
        console.warn('Supabase orders fetch notice:', response.error.message);
        return localOrders;
      }

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Filter out dummy sample orders if any were synced to remote
        const cleanRemote = (response.data as Order[]).filter(o => !DUMMY_SAMPLE_ORDER_IDS.has(o.id));
        setLocal(STORAGE_KEYS.ORDERS, cleanRemote);
        return cleanRemote;
      }

      return localOrders;
    } catch (err) {
      console.warn('Supabase not reachable, using local order storage');
      return localOrders;
    }
  },

  addOrder: async (order: Order) => {
    // 1. Immediately persist in local storage
    const currentOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = [order, ...currentOrders.filter(o => o.id !== order.id)];
    setLocal(STORAGE_KEYS.ORDERS, updated);

    // 2. Sync to Supabase in background if configured
    const client = getSupabaseClient();
    if (!client) return;

    try {
      await withTimeout(client.from('orders').insert([order]), 4000);
    } catch (err) {
      console.warn('Background Supabase insert skipped/failed');
    }
  },

  updateOrder: async (order: Order) => {
    // 1. Update in local storage
    const currentOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = currentOrders.map(o => o.id === order.id ? order : o);
    setLocal(STORAGE_KEYS.ORDERS, updated);

    // 2. Sync to Supabase if configured
    const client = getSupabaseClient();
    if (!client) return;

    try {
      await withTimeout(client.from('orders').update(order).eq('id', order.id), 4000);
    } catch (err) {
      console.warn('Background Supabase update skipped/failed');
    }
  },

  deleteOrder: async (id: string) => {
    // 1. Remove from local storage
    const currentOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = currentOrders.filter(o => o.id !== id);
    setLocal(STORAGE_KEYS.ORDERS, updated);

    // 2. Sync to Supabase if configured
    const client = getSupabaseClient();
    if (!client) return;

    try {
      await withTimeout(client.from('orders').delete().eq('id', id), 4000);
    } catch (err) {
      console.warn('Background Supabase delete skipped/failed');
    }
  },

  // Clear all orders (removes dummy and test data)
  clearAllOrders: async (): Promise<void> => {
    setLocal(STORAGE_KEYS.ORDERS, []);
    const client = getSupabaseClient();
    if (client) {
      try {
        await withTimeout(client.from('orders').delete().neq('id', 'placeholder'), 4000);
      } catch (err) {
        console.warn('Supabase orders clear failed:', err);
      }
    }
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    let localProducts = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    
    // If empty or lacking image attributes, refresh with official scraped catalog
    const hasImages = localProducts.some(p => Boolean(p.image));
    if (localProducts.length === 0 || !hasImages || localProducts.length < 20) {
      localProducts = DEFAULT_PRODUCTS;
      setLocal(STORAGE_KEYS.PRODUCTS, localProducts);
    } else {
      // Ensure image and offer attributes are enriched from official catalog
      const catalogMap = new Map(IGLOO_OFFICIAL_CATALOG.map(item => [item.name.toLowerCase().trim(), item]));
      let modified = false;
      const enriched = localProducts.map(p => {
        const official = catalogMap.get(p.name.toLowerCase().trim());
        if (official) {
          if (!p.image || p.image !== official.image || p.isOffer !== official.isOffer) {
            modified = true;
            return {
              ...p,
              image: official.image,
              category: official.category,
              url: official.url,
              oldPrice: official.oldPrice,
              isOffer: official.isOffer,
              offerText: official.offerText,
            };
          }
        }
        return p;
      });
      if (modified) {
        localProducts = enriched;
        setLocal(STORAGE_KEYS.PRODUCTS, localProducts);
      }
    }

    const client = getSupabaseClient();
    if (!client) {
      return localProducts;
    }

    try {
      const response = await withTimeout(
        client.from('products').select('*').order('name')
      );

      if (response.error) {
        console.warn('Supabase products fetch notice:', response.error.message);
        return localProducts;
      }

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setLocal(STORAGE_KEYS.PRODUCTS, response.data);
        return response.data as Product[];
      }

      // If remote table is empty, push default products
      if (response.data && response.data.length === 0 && localProducts.length > 0) {
        Promise.resolve(client.from('products').upsert(localProducts)).catch(() => {});
      }

      return localProducts;
    } catch (err) {
      console.warn('Supabase products unavailable, using local cache');
      return localProducts;
    }
  },

  syncFromIgloobd: async (currentProducts: Product[]): Promise<{
    products: Product[];
    addedCount: number;
    updatedCount: number;
    totalCount: number;
  }> => {
    const officialCatalog = getIglooProductsAsAppProducts();
    const updatedList: Product[] = [...currentProducts];
    let addedCount = 0;
    let updatedCount = 0;

    for (const official of officialCatalog) {
      const existingIndex = updatedList.findIndex(
        p => p.name.trim().toLowerCase() === official.name.trim().toLowerCase() ||
             p.id === official.id
      );

      if (existingIndex >= 0) {
        const cur = updatedList[existingIndex];
        const needsUpdate = 
          cur.price !== official.price ||
          cur.image !== official.image ||
          cur.isOffer !== official.isOffer ||
          cur.offerText !== official.offerText ||
          cur.oldPrice !== official.oldPrice;

        if (needsUpdate) {
          updatedList[existingIndex] = {
            ...cur,
            name: official.name,
            price: official.price,
            image: official.image,
            category: official.category,
            url: official.url,
            oldPrice: official.oldPrice,
            isOffer: official.isOffer,
            offerText: official.offerText,
          };
          updatedCount++;
        }
      } else {
        updatedList.push(official);
        addedCount++;
      }
    }

    // Save synced products locally
    setLocal(STORAGE_KEYS.PRODUCTS, updatedList);

    // Sync to Supabase in background if configured
    const client = getSupabaseClient();
    if (client) {
      try {
        await withTimeout(client.from('products').upsert(updatedList), 4000);
      } catch (err) {
        console.warn('Background Supabase sync notice:', err);
      }
    }

    // CRITICAL: Historic order entries in STORAGE_KEYS.ORDERS are completely untouched!
    return {
      products: updatedList,
      addedCount,
      updatedCount,
      totalCount: updatedList.length
    };
  },


  syncProducts: async (products: Product[]) => {
    setLocal(STORAGE_KEYS.PRODUCTS, products);

    const client = getSupabaseClient();
    if (!client) return;

    try {
      await withTimeout(client.from('products').upsert(products), 4000);
    } catch (err) {
      console.warn('Background Supabase products sync skipped/failed');
    }
  },

  deleteProduct: async (id: string) => {
    const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    setLocal(STORAGE_KEYS.PRODUCTS, current.filter(p => p.id !== id));

    const client = getSupabaseClient();
    if (!client) return;

    try {
      await withTimeout(client.from('products').delete().eq('id', id), 4000);
    } catch (err) {
      console.warn('Background Supabase product delete skipped/failed');
    }
  },

  // Members
  getMembers: async (): Promise<TeamMember[]> => {
    let localMembers = getLocal<TeamMember[]>(STORAGE_KEYS.MEMBERS, []);
    if (localMembers.length === 0) {
      localMembers = DEFAULT_MEMBERS;
      setLocal(STORAGE_KEYS.MEMBERS, localMembers);
    }

    const client = getSupabaseClient();
    if (!client) {
      return localMembers;
    }

    try {
      const response = await withTimeout(
        client.from('members').select('*').order('name')
      );

      if (response.error) {
        console.warn('Supabase members fetch notice:', response.error.message);
        return localMembers;
      }

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setLocal(STORAGE_KEYS.MEMBERS, response.data);
        return response.data as TeamMember[];
      }

      // If remote table is empty, push default members
      if (response.data && response.data.length === 0 && localMembers.length > 0) {
        Promise.resolve(client.from('members').upsert(localMembers)).catch(() => {});
      }

      return localMembers;
    } catch (err) {
      console.warn('Supabase members unavailable, using local cache');
      return localMembers;
    }
  },

  syncMembers: async (members: TeamMember[]) => {
    setLocal(STORAGE_KEYS.MEMBERS, members);

    const client = getSupabaseClient();
    if (!client) return;

    try {
      await withTimeout(client.from('members').upsert(members), 4000);
    } catch (err) {
      console.warn('Background Supabase members sync skipped/failed');
    }
  },

  deleteMember: async (id: string) => {
    const current = getLocal<TeamMember[]>(STORAGE_KEYS.MEMBERS, []);
    setLocal(STORAGE_KEYS.MEMBERS, current.filter(m => m.id !== id));

    const client = getSupabaseClient();
    if (!client) return;

    try {
      await withTimeout(client.from('members').delete().eq('id', id), 4000);
    } catch (err) {
      console.warn('Background Supabase member delete skipped/failed');
    }
  },

  // Knowledge Base Items (FB Reply Knowledge Base)
  getKBItems: async (): Promise<FAQItem[]> => {
    let localItems = getLocal<FAQItem[]>(STORAGE_KEYS.KB_ITEMS, []);
    if (!localItems || localItems.length === 0) {
      localItems = KNOWLEDGE_BASE_ITEMS;
      setLocal(STORAGE_KEYS.KB_ITEMS, localItems);
    }

    const client = getSupabaseClient();
    if (!client) {
      return localItems;
    }

    try {
      const response = await withTimeout(
        client.from('kb_items').select('*').order('createdAt', { ascending: false })
      );

      if (response.error) {
        console.warn('Supabase kb_items fetch notice:', response.error.message);
        return localItems;
      }

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const remoteItems: FAQItem[] = response.data.map((row: any) => ({
          id: row.id,
          category: row.category || 'general',
          categoryLabel: row.categoryLabel || row.category_label || 'General FAQs',
          topic: row.topic,
          question: row.question || '',
          englishReply: row.englishReply || row.english_reply || '',
          banglaReply: row.banglaReply || row.bangla_reply || '',
          tags: Array.isArray(row.tags) ? row.tags : (typeof row.tags === 'string' ? JSON.parse(row.tags) : []),
          isCustom: row.isCustom ?? row.is_custom ?? true,
          createdAt: row.createdAt || row.created_at,
          updatedAt: row.updatedAt || row.updated_at,
        }));

        // Merge remote items with local default knowledge base items so nothing is lost
        const remoteMap = new Map(remoteItems.map(r => [r.id, r]));
        const merged: FAQItem[] = [...remoteItems];
        for (const localItem of localItems) {
          if (!remoteMap.has(localItem.id)) {
            merged.push(localItem);
          }
        }

        setLocal(STORAGE_KEYS.KB_ITEMS, merged);
        return merged;
      }

      return localItems;
    } catch (err) {
      console.warn('Supabase kb_items unavailable, using local cache');
      return localItems;
    }
  },

  addKBItem: async (item: Omit<FAQItem, 'id'> & { id?: string }): Promise<FAQItem> => {
    const newItem: FAQItem = {
      ...item,
      id: item.id || `kb_custom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const current = getLocal<FAQItem[]>(STORAGE_KEYS.KB_ITEMS, KNOWLEDGE_BASE_ITEMS);
    const updated = [newItem, ...current.filter(i => i.id !== newItem.id)];
    setLocal(STORAGE_KEYS.KB_ITEMS, updated);

    const client = getSupabaseClient();
    if (client) {
      try {
        await withTimeout(
          client.from('kb_items').upsert({
            id: newItem.id,
            category: newItem.category,
            categoryLabel: newItem.categoryLabel,
            topic: newItem.topic,
            question: newItem.question || '',
            englishReply: newItem.englishReply,
            banglaReply: newItem.banglaReply,
            tags: newItem.tags || [],
            isCustom: true,
            createdAt: newItem.createdAt,
            updatedAt: new Date().toISOString(),
          }),
          4000
        );
      } catch (err) {
        console.warn('Supabase addKBItem background save notice:', err);
      }
    }

    return newItem;
  },

  updateKBItem: async (item: FAQItem): Promise<FAQItem> => {
    const updatedItem = { ...item, updatedAt: new Date().toISOString() };
    const current = getLocal<FAQItem[]>(STORAGE_KEYS.KB_ITEMS, KNOWLEDGE_BASE_ITEMS);
    const updated = current.map(i => i.id === item.id ? updatedItem : i);
    setLocal(STORAGE_KEYS.KB_ITEMS, updated);

    const client = getSupabaseClient();
    if (client) {
      try {
        await withTimeout(
          client.from('kb_items').upsert({
            id: updatedItem.id,
            category: updatedItem.category,
            categoryLabel: updatedItem.categoryLabel,
            topic: updatedItem.topic,
            question: updatedItem.question || '',
            englishReply: updatedItem.englishReply,
            banglaReply: updatedItem.banglaReply,
            tags: updatedItem.tags || [],
            isCustom: updatedItem.isCustom ?? true,
            updatedAt: updatedItem.updatedAt,
          }),
          4000
        );
      } catch (err) {
        console.warn('Supabase updateKBItem warning:', err);
      }
    }

    return updatedItem;
  },

  deleteKBItem: async (id: string): Promise<void> => {
    const current = getLocal<FAQItem[]>(STORAGE_KEYS.KB_ITEMS, KNOWLEDGE_BASE_ITEMS);
    const updated = current.filter(i => i.id !== id);
    setLocal(STORAGE_KEYS.KB_ITEMS, updated);

    const client = getSupabaseClient();
    if (client) {
      try {
        await withTimeout(
          client.from('kb_items').delete().eq('id', id),
          4000
        );
      } catch (err) {
        console.warn('Supabase deleteKBItem warning:', err);
      }
    }
  },

  // Reset data to clean initial state (clears all dummy/test orders)
  resetToCleanData: () => {
    setLocal(STORAGE_KEYS.ORDERS, []);
    setLocal(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    setLocal(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    setLocal(STORAGE_KEYS.KB_ITEMS, KNOWLEDGE_BASE_ITEMS);
    return {
      orders: [],
      products: DEFAULT_PRODUCTS,
      members: DEFAULT_MEMBERS
    };
  }
};
