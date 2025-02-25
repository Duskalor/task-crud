'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

import {
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { ActionsCell } from './ActionsCell';
import { StatusCell } from './StatusCell';
import { DialogNewTask } from './dialog-new-task';
import { tasksExample } from '@/app/test/page';
import { useRealTime } from '@/hooks/useRealTime';
import { Task } from '@/types/Task';
import { IStatus } from '@/types/Status';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div
          className=' px-6 py-4 cursor-pointer select-none flex items-center gap-2 font-semibold text-gray-700'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Task
          <ArrowUpDown className='w-4 h-4' />
        </div>
      );
    },
    cell: ({ row }) => {
      const task = row.original as Task;
      const name: string = row.getValue('name');
      // (row.getValue('name') as string).length > 15
      //   ? (row.getValue('name') as string).slice(0, 15) + '...'
      //   : row.getValue('name');
      return (
        <div className=''>
          <p className='font-semibold text-gray-900'>{name}</p>
          <p className='text-gray-500 text-sm'>{task.description}</p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'description',
  //   header: () => <div className=''>Description</div>,
  //   cell: ({ row }) => (
  //     <div className='lowercase'>
  //       {(row.getValue('description') as string).length > 15
  //         ? (row.getValue('description') as string).slice(0, 15) + '...'
  //         : row.getValue('description')}
  //     </div>
  //   ),
  // },
  {
    accessorKey: 'status_id',
    header: () => <div className='text-center'>Status</div>,
    cell: StatusCell,
  },
  {
    header: () => (
      <div className='text-center active:bg-sidebar-primary'>Actions</div>
    ),
    id: 'actions',
    enableHiding: false,
    cell: ActionsCell,
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
  // const [data, setData] = useState(tasksExample);
  const { data, setData } = useRealTime(tasksExample, status);
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
      <div className=' w-full  mt-10'>
        <div className=' max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white'>
          <table className='w-full'>
            <thead className='bg-gray-100'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-left'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className='font-semibold text-gray-700'
                        // style={{ width: header.getSize() }}
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
      {/* <div className=' border h-full max-h-[790px] overflow-y-auto '>
        <table className={`max-w-2xl mx-auto mt-5  shadow-lg  rounded-lg`}>
          <thead className='bg-gray-100'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className=''>
                {headerGroup.headers.map((header) => {
                  return (
                    <td
                      key={header.id}
                      className='font-semibold text-gray-700 px-6 py-4'
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </td>
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
                    <CustomTableRow
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
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </CustomTableRow>
                  );
                })}
              </AnimatePresence>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};
