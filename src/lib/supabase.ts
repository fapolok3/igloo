/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'localStorage' | 'none';
}

/**
 * Safely retrieve Supabase credentials from localStorage or environment variables.
 * Filters out invalid/unreachable placeholder hosts.
 */
export function getSupabaseCredentials(): SupabaseConfig {
  try {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('igloo_supabase_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (
          parsed.url &&
          parsed.anonKey &&
          typeof parsed.url === 'string' &&
          parsed.url.startsWith('https://') &&
          !parsed.url.includes('kcugywbwoqzgivksuisj')
        ) {
          return {
            url: parsed.url.trim(),
            anonKey: parsed.anonKey.trim(),
            isConfigured: true,
            source: 'localStorage'
          };
        }
      }
    }
  } catch (e) {
    // Ignore JSON parsing errors
  }

  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // Guard against deleted or unresolvable test placeholder project
  const isPlaceholder = envUrl.includes('kcugywbwoqzgivksuisj') || !envUrl.startsWith('https://');

  if (envUrl && envKey && !isPlaceholder) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
      source: 'env'
    };
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
    source: 'none'
  };
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

/**
 * Returns a real SupabaseClient if configured with valid credentials, or null if in local storage mode.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.isConfigured || !creds.url || !creds.anonKey) {
    cachedClient = null;
    return null;
  }

  if (!cachedClient || lastUrl !== creds.url || lastKey !== creds.anonKey) {
    try {
      cachedClient = createClient(creds.url, creds.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      lastUrl = creds.url;
      lastKey = creds.anonKey;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      cachedClient = null;
    }
  }

  return cachedClient;
}

/**
 * Proxy object ensuring `import { supabase } from '../lib/supabase'` never crashes with
 * "supabaseUrl is required" or throws when credentials are not configured.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      if (prop === 'from') {
        return () => ({
          select: () => Promise.resolve({ data: null, error: null }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
          delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
          upsert: () => Promise.resolve({ data: null, error: null }),
        });
      }
      return undefined;
    }
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});
