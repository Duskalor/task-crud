import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type StatusKey = 'to do' | 'in_progress' | 'done';

type Props = {
  row: { original: { status: { name: string } } };
};

// type Variants = 'red' | 'yellow' | 'green';

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

export const StatusCell = ({ row }: Props) => {
  const nameCell = row.original.status.name;
  const selectedColor = selectColor(nameCell);
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
            className={`bg-${value.color}-500 text-white font-bold select-none`}
          >
            {value.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
