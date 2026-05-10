/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface TeamMember {
  id: string;
  name: string;
}

export type OrderSource = 'Website' | 'Facebook';

export interface Order {
  id: string;
  date: string; // ISO format or YYYY-MM-DD
  clientName: string;
  phone: string;
  source: OrderSource;
  product: string; // Product name
  qty: number;
  unitPrice: number;
  totalAmount: number;
  assignedPerson: string;
  notes?: string;
  createdAt: string;
}

export type View = 'Dashboard' | 'OrderEntry' | 'Reports' | 'DailyReport' | 'WeeklyReport' | 'MonthlyReport' | 'YearlyReport' | 'Settings';
