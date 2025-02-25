import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Task } from '@/types/Task';
import { IStatus } from '@/types/Status';

export const useRealTime = (tasks: Task[], status: IStatus) => {
  const [data, setData] = useState<Task[]>(tasks);
  useEffect(() => {
    const fetchStatus = async (statusId: string) => {
      const data = status.find((status) => status.id === statusId);
      return { name: data ? data.name : 'in progress' };
    };

    const subscription = supabase
      .channel('realtime:table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const selectStatus = await fetchStatus(payload.new.status_id);
            if (selectStatus) {
              setData((prev) => [
                ...prev,
                { ...payload.new, status: selectStatus } as Task,
              ]);
            }
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item) => item.task_id !== payload.old.task_id)
            );
          } else if (payload.eventType === 'UPDATE') {
            const selectStatus = await fetchStatus(payload.new.status_id);
            if (selectStatus) {
              setData((prev) =>
                prev.map((item) =>
                  item.task_id === payload.new.task_id
                    ? ({ ...payload.new, status: selectStatus } as Task)
                    : item
                )
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { data, setData };
};
