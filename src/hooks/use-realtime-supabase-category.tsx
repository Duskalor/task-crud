import { Category } from '@/app/(Task)/categories/components/categories-table';
import { actionsRealTimeCategory } from '@/lib/realtime-category';
import { supabase } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const fetchCategory = async () => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const useRealtimeCategory = () => {
  const queryClient = useQueryClient();

  const { data = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategory,
  });
  useEffect(() => {
    const { actions } = actionsRealTimeCategory();
    const subscription = supabase
      .channel('realtime:table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          const previousCategories: Category[] =
            queryClient.getQueryData(['categories']) || [];
          const action = actions[payload.eventType];
          const newCategories = action(previousCategories, payload);
          queryClient.setQueryData(['categories'], newCategories);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);

  return { data };
};
