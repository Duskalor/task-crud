import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/Task';

type StatusKey = 'to do' | 'in_progress' | 'done';

// type Variants = 'red' | 'yellow' | 'green';

const changedStatus: Record<string, string> = {
  ['To Do']: 'to do',
  'In Progress': 'in_progress',
  Done: 'done',
};

const status = {
  ['to do']: {
    color: 'red',
    name: 'To Do',
  },
  in_progress: {
    color: 'yellow',
    name: 'In Progress',
  },
  done: {
    color: 'green',
    name: 'Done',
  },
};

const selectColor = (text: string) => {
  return status[text as StatusKey];
};
type Props = {
  row: { original: { status: { name: string }; task_id: string } };
  table: {
    options: {
      meta: { updateTask: (id: string, data: Partial<Task>) => void };
    };
  };
};

export const StatusCell = ({ row, table }: any) => {
  const nameCell = row.original.status.name;
  const selectedColor = selectColor(nameCell);
  const changestatus = table.options.meta.updateTask;

  const handleChangeStatus = async (status: string) => {
    changestatus(row.original.task_id, {
      ...row.original,
      status: changedStatus[status],
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='w-full h-full flex justify-center select-none '>
        <div
          className={`bg-${selectedColor.color}-500  text-white capitalize px-3 py-0 rounded
          focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0
          `}
        >
          <span className='capitalize'>{selectedColor.name}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent autoFocus={false}>
        {Object.values(status).map((value) => (
          <DropdownMenuItem
            key={value.name}
            onClick={() => handleChangeStatus(value.name)}
            className={`bg-${value.color}-500 text-white font-bold select-none`}
          >
            {value.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
