'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='lowercase p-2'>{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: () => <div className=''>Description</div>,
    cell: ({ row }) => (
      <div className='lowercase'>{row.getValue('description')}</div>
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
}: {
  tasks: Task[];
  categories_id: string;
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
    const subscription = supabase
      .channel('realtime:table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            supabase
              .from('status')
              .select('*')
              .eq('status_id', payload.new.status_id)
              .single()
              .then((status) => {
                setData((prev) => [...prev, payload.new as Task]);
              });
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item) => item.task_id !== payload.old.task_id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                item.task_id === payload.new.task_id
                  ? (payload.new as Task)
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder='Filters...'
          className='max-w-sm'
          value={filtered}
          onChange={(e) => setFiltered(e.target.value)}
        />
        <DialogNewTask categories_id={categories_id} />
      </div>
      <div className='rounded-md border'>
        <Table className={`w-${table.getTotalSize()} mx-auto`}>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
