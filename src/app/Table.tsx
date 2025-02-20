'use client';
'use no memo';
import { useEffect, useState } from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DialogNewCategory } from '@/components/dialog-new-category';

import { ActionsCell } from '@/components/ActionsCell';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export type Category = {
  categories_id: string;
  name: string;
  description: string;
  created_at: string;
};

export const columns: ColumnDef<Category>[] = [
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
    id: 'actions',
    enableHiding: false,
    cell: ActionsCell,
  },
];

export function DataTableDemo({ categories }: { categories: Category[] }) {
  const [data, setData] = useState(categories);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtered, setFiltered] = useState('');
  const router = useRouter();
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
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as Category]);
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter(
                (item) => item.categories_id !== payload.old.categories_id
              )
            );
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                item.categories_id === payload.new.categories_id
                  ? (payload.new as Category)
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
        <DialogNewCategory />
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='cursor-pointer'
                      onClick={() => {
                        router.push(
                          `/categories/${row.original.categories_id}`
                        );
                      }}
                    >
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
}
