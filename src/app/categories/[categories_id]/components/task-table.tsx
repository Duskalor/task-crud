'use client';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DialogNewTask } from './dialog-new-task';
import { useRealTime } from '@/hooks/use-real-time';
import { Task } from '@/types/Task';
import { IStatus } from '@/types/Status';
import { supabase } from '@/utils/supabase/client';
import { StatusCell } from './status-cell';
import { ActionsCell } from './actions-cell';
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div
          className=' px-6 py-4 cursor-pointer select-none flex items-center gap-2 font-semibold text-gray-700'
          onClick={() => column.toggleSorting()}
        >
          Task
          {{
            asc: <ArrowUp className='w-4 h-4' />,
            desc: <ArrowDown className='w-4 h-4' />,
          }[column.getIsSorted() as string] ?? null}
        </div>
      );
    },
    cell: ({ row }) => {
      const task = row.original as Task;
      const name: string = row.getValue('name');
      return (
        <div className=''>
          <p className='font-semibold text-gray-900'>{name}</p>
          <p className='text-gray-500 text-sm'>{task.description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status_id',
    header: () => <div className='text-center'>Status</div>,
    cell: StatusCell,
    enableSorting: false,
  },
  {
    header: () => <div className='text-center '>Actions</div>,
    id: 'actions',
    enableHiding: false,
    cell: ActionsCell,
    enableSorting: false,
  },
];

export const TaskTable = ({
  tasks,
  categories_id,
  status,
}: {
  tasks: Task[];
  categories_id: string;
  status: IStatus;
}) => {
  const { data, setData } = useRealTime(tasks, status);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtered, setFiltered] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtered,
    },
    onGlobalFilterChange: setFiltered,
    onSortingChange: setSorting,
    meta: {
      updateTask: async (task_id: string, data: Partial<Task>) => {
        const res = await supabase
          .from('task')
          .update(data)
          .eq('task_id', task_id);
        console.log({ res });
      },
    },
  });

  return (
    <div className='w-full flex flex-col h-full overflow-hidden'>
      <div className='flex items-center flex-col sm:flex-row gap-5 sm:gap-0 justify-between py-4'>
        <Input
          placeholder='Filters...'
          className='max-w-sm'
          value={filtered}
          onChange={(e) => setFiltered(e.target.value)}
        />
        <DialogNewTask categories_id={categories_id} />
      </div>
      <div className=' w-full'>
        <div className=' max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white'>
          <table className='w-full'>
            <thead className='bg-gray-100'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-left'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className='font-semibold text-gray-700 select-none'
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                <AnimatePresence>
                  {table.getRowModel().rows.map((row, i) => {
                    const id = row.original.task_id;
                    return (
                      <motion.tr
                        className='border-b hover:bg-gray-50 transition'
                        key={id}
                        layout='position'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          position: 'absolute',
                          width: '100%',
                          pointerEvents: 'none',
                        }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className='px-6 py-4'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
