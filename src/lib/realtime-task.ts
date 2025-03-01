import { IStatus } from '@/types/Status';
import { Task } from '@/types/Task';

export const actionsRealTimeTask = (status: IStatus) => {
  const fetchStatus = (statusId: string) => {
    const data = status.find((status) => status.id === statusId);
    return { name: data ? data.name : 'in progress' };
  };

  const actions: Record<string, (tasks: Task[], payload: any) => Task[]> = {
    INSERT: (tasks: Task[], payload: any) => {
      const selectStatus = fetchStatus(payload.new.status_id);
      return selectStatus
        ? [...tasks, { ...payload.new, status: selectStatus }]
        : tasks;
    },
    DELETE: (tasks: Task[], payload: any) => {
      return tasks.filter((item) => item.task_id !== payload.old.task_id);
    },
    UPDATE: (tasks: Task[], payload: any) => {
      const selectStatus = fetchStatus(payload.new.status_id);
      return selectStatus
        ? tasks.map((item) =>
            item.task_id === payload.new.task_id
              ? ({ ...payload.new, status: selectStatus } as Task)
              : item
          )
        : tasks;
    },
  };
  return { actions };
};
