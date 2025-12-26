import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Business {
  id: string;
  name: string;
  owner: string;
  contact: string;
  address: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessFormData {
  name: string;
  owner: string;
  contact: string;
  address: string;
  category: string;
}

export function useBusinesses() {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Business[];
    },
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (business: BusinessFormData) => {
      const { data, error } = await supabase
        .from('businesses')
        .insert(business)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add business: ' + error.message);
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Business> & { id: string }) => {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update business: ' + error.message);
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete business: ' + error.message);
    },
  });
}
