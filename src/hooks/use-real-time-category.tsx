import { Category } from '@/app/categories/components/categories-table';
import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export const useRealtimeCategory = (categories: Category[]) => {
  const [data, setData] = useState(categories);
  useEffect(() => {
    const subscription = supabase
      .channel('realtime:table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as Category]);
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter(
                (item) => item.categories_id !== payload.old.categories_id
              )
            );
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                item.categories_id === payload.new.categories_id
                  ? (payload.new as Category)
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  return { data };
};
