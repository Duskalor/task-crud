import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Task } from '@/types/Task';
import { IStatus } from '@/types/Status';
import { actionsRealTime } from '@/lib/realtime-supabase';

export const useRealTime = (tasks: Task[], status: IStatus) => {
  const [data, setData] = useState<Task[]>(tasks);
  useEffect(() => {
    const { actions } = actionsRealTime(status);
    const subscription = supabase
      .channel('realtime:table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task' },
        async (payload: any) => {
          const action = actions[payload.eventType];
          const newData = action(data, payload);
          setData(newData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { data, setData };
};
