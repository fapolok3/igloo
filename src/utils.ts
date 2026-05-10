/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, Product, TeamMember } from './types';
import { format, subDays } from 'date-fns';

const STORAGE_KEYS = {
  ORDERS: 'igloo_orders',
  PRODUCTS: 'igloo_products',
  MEMBERS: 'igloo_members',
};

export const Storage = {
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }
};

export const fetchIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) });
        const data = await response.json();
        return data.ip;
    } catch (e) {
        return '127.0.0.1';
    }
};

export const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString('en-BD')}`;
};

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy');
  } catch (e) {
    return dateString;
  }
};
