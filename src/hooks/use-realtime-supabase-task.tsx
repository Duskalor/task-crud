import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Task } from '@/types/Task';
import { IStatus } from '@/types/Status';
import { actionsRealTimeTask } from '@/lib/realtime-task';

export const useRealTimeTask = (initalTasks: Task[], status: IStatus) => {
  const [tasks, setTasks] = useState<Task[]>(initalTasks);

  useEffect(() => {
    const { actions } = actionsRealTimeTask(status);
    const subscription = supabase
      .channel('realtime:table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task' },
        (payload: any) => {
          const action = actions[payload.eventType];
          setTasks((prev) => action(prev, payload));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { data: tasks };
};
