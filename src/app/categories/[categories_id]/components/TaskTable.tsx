'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import { supabase } from '@/utils/supabase/client';
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
import { useState, useEffect } from 'react';
import { ActionsCell } from './ActionsCell';
import { StatusCell } from './StatusCell';
import { DialogNewTask } from './dialog-new-task';

export type Task = {
  task_id: string;
  name: string;
  description: string;
  status: { name: string };
};
const CustomTableRow = motion.create(TableRow);

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Task
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='lowercase p-2'>
        {(row.getValue('name') as string).length > 15
          ? (row.getValue('name') as string).slice(0, 15) + '...'
          : row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: () => <div className=''>Description</div>,
    cell: ({ row }) => (
      <div className='lowercase'>
        {(row.getValue('description') as string).length > 15
          ? (row.getValue('description') as string).slice(0, 15) + '...'
          : row.getValue('description')}
      </div>
    ),
  },
  {
    accessorKey: 'status_id',
    header: () => <div className=''>Status</div>,
    cell: StatusCell,
  },
  {
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
  status: { id: string; name: string }[];
}) => {
  const [data, setData] = useState(tasks);
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

  return (
    <div className='w-full flex flex-col h-full overflow-hidden'>
      <div className='flex items-center  flex-col sm:flex-row gap-5 sm:gap-0 justify-between py-4'>
        <Input
          placeholder='Filters...'
          className='max-w-sm'
          value={filtered}
          onChange={(e) => setFiltered(e.target.value)}
        />
        <DialogNewTask categories_id={categories_id} />
      </div>
      <div className='rounded-md border h-full max-h-[790px] overflow-y-auto'>
        <Table className={`max-w-3xl mx-auto`}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
