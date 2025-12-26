import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category: string;
  price: number;
  current_stock: number;
  min_stock: number;
  business_id: string | null;
  created_at: string;
  updated_at: string;
  business_name?: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  current_stock: number;
  min_stock: number;
  business_id?: string;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          businesses (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((p: any) => ({
        ...p,
        business_name: p.businesses?.name || 'Unknown Business',
      })) as Product[];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductFormData) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add product: ' + error.message);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update product: ' + error.message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete product: ' + error.message);
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      quantity, 
      type, 
      notes 
    }: { 
      productId: string; 
      quantity: number; 
      type: 'in' | 'out'; 
      notes?: string;
    }) => {
      // Get current stock
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('current_stock')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      const previousStock = product.current_stock;
      const newStock = type === 'in' 
        ? previousStock + quantity 
        : Math.max(0, previousStock - quantity);

      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Add stock history record
      const { error: historyError } = await supabase
        .from('stock_history')
        .insert({
          product_id: productId,
          change_amount: type === 'in' ? quantity : -quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          change_type: type,
          notes: notes || null,
        });

      if (historyError) throw historyError;

      return { previousStock, newStock };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock_history'] });
      toast.success('Stock updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update stock: ' + error.message);
    },
  });
}

export function useStockHistory() {
  return useQuery({
    queryKey: ['stock_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_history')
        .select(`
          *,
          products (
            name,
            sku
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });
}
