'use client';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { useState } from 'react';
import { DialogNewTask } from './dialog-new-task';
import { Task } from '@/types/Task';
import { IStatus } from '@/types/Status';
import { supabase } from '@/utils/supabase/client';
import { StatusCell } from './status-cell';
import { ActionsCell } from './actions-cell';
import { ArrowDown, ArrowUp } from 'lucide-react';
import dayjs from 'dayjs';
import {
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  Row,
} from '@tanstack/react-table';
import { useRealTimeTask } from '@/hooks/use-realtime-supabase-task';

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
        <div>
          <p className='font-semibold text-gray-900'>{name}</p>
          <p className='text-gray-500 text-sm'>{task.description}</p>
        </div>
      );
    },
    size: 250,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => row.getValue('description'),
    enableHiding: true, // Permite ocultarla
    meta: { isHidden: true }, // Meta custom para identificar que está oculta
    size: 0, // Opcional: hace que sea casi invisible en el layout
  },
  {
    accessorKey: 'created_at',
    header: () => <div className='text-center'>Create at</div>,
    cell: ({ row }) => {
      const due_date: string = row.getValue('created_at');
      return (
        <div className='text-center'>
          <p className='font-semibold text-gray-900'>
            {dayjs(due_date).format('DD/MM/YYYY')}
          </p>
          <p className='text-gray-500 text-sm'>
            {dayjs(due_date).format('hh:mm A')}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status_id',
    header: ({ column }) => (
      <div
        className='text-center flex justify-center gap-2 cursor-pointer items-center'
        onClick={() => column.toggleSorting()}
      >
        Status
        {{
          asc: <ArrowUp className='w-4 h-4' />,
          desc: <ArrowDown className='w-4 h-4' />,
        }[column.getIsSorted() as string] ?? null}
      </div>
    ),
    cell: StatusCell,
    // enableSorting: false,
  },
  {
    header: () => <div className='text-center '>Actions</div>,
    id: 'actions',
    enableHiding: false,
    cell: ActionsCell,
    enableSorting: false,
    size: 40,
  },
];

export const TaskTable = ({
  tasks,
  categories_id,
  status,
  categoriesName,
}: {
  tasks: Task[];
  categories_id: string;
  status: IStatus;
  categoriesName: string;
}) => {
  const { data } = useRealTimeTask(tasks, status);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setFiltered] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility: {
        description: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFiltered,
    onSortingChange: setSorting,
    meta: {
      updateTask: async (task_id: string, data: any) => {
        const { status: newstatus, ...all } = data;
        const { id: idStatus } = status.find(
          (sta) => sta.name === newstatus
        ) ?? { id: status[0].id };
        await supabase
          .from('task')
          .update({ ...all, status_id: idStatus })
          .eq('task_id', task_id);
      },
    },
  });

  return (
    <div className='w-full flex flex-col h-full overflow-hidden'>
      <div className=' w-full  relative flex items-center flex-col sm:flex-row gap-5 sm:gap-0 justify-between py-4'>
        <h2 className='text-2xl sm:hidden capitalize font-bold text-center'>
          {categoriesName}
        </h2>
        <div className='flex w-full  justify-between items-center gap-3'>
          <Input
            placeholder='Filters...'
            className='max-w-sm w-full  focus:outline-none'
            value={globalFilter}
            onChange={(e) => setFiltered(e.target.value)}
          />
          <DialogNewTask categories_id={categories_id} />
        </div>
        <h2 className='absolute hidden sm:block left-1/2 transform -translate-x-1/2 text-3xl capitalize font-bold'>
          {categoriesName}
        </h2>
      </div>
      <div className=' w-full'>
        <div className='border-collapse max-w-3xl mx-auto mt-10'>
          <table className='w-full'>
            <thead className='bg-gray-100'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-left'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        style={{ width: header.getSize() }}
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

            <motion.tbody
              transition={{ duration: 0.5 }}
              layout
              className='rounded-lg shadow-lg  bg-white overflow-hidden relative w-full'
            >
              {table.getRowModel().rows?.length ? (
                <AnimatePresence initial={false}>
                  {table.getRowModel().rows.map((row) => {
                    const id = row.original.task_id;
                    return <TR row={row} key={id} />;
                  })}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function TR({ row }: { row: Row<Task> }) {
  let isPresent = useIsPresent();
  return (
    <motion.tr
      layout
      className='hover:bg-gray-50  w-full'
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: isPresent ? 'relative' : 'absolute',
        display: isPresent ? 'table-row' : 'flex',
        alignItems: isPresent ? '' : 'center',
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className='px-6 py-4 w-1/4'>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </motion.tr>
  );
}
