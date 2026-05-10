import { supabase } from '../lib/supabase';
import { Order, Product, TeamMember } from '../types';

export const dataService = {
  // Orders
  getOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data as Order[];
  },
  
  addOrder: async (order: Order) => {
    const { error } = await supabase
      .from('orders')
      .insert([order]);
    
    if (error) {
      console.error('Error adding order:', error);
    }
  },
  
  updateOrder: async (order: Order) => {
    const { error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', order.id);
    
    if (error) {
      console.error('Error updating order:', error);
    }
  },
  
  deleteOrder: async (id: string) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting order:', error);
    }
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data as Product[];
  },
  
  syncProducts: async (products: Product[]) => {
    // For simplicity with the current frontend logic, we'll upsert
    // But since the frontend sends the whole list, we might need to handle deletions too
    // A better way is to handle individual ADD/UPDATE/DELETE
    // For now, let's just upsert what we have.
    const { error } = await supabase
      .from('products')
      .upsert(products);
    
    if (error) {
      console.error('Error syncing products:', error);
    }
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
    }
  },

  // Members
  getMembers: async (): Promise<TeamMember[]> => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching members:', error);
      return [];
    }
    return data as TeamMember[];
  },
  
  syncMembers: async (members: TeamMember[]) => {
    const { error } = await supabase
      .from('members')
      .upsert(members);
    
    if (error) {
      console.error('Error syncing members:', error);
    }
  },

  deleteMember: async (id: string) => {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting member:', error);
    }
  }
};
