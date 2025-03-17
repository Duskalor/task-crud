'use client';
'use no memo';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useState } from 'react';
import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ActionsCell } from '@/app/(Task)/categories/components/actions-cell';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { DialogNewCategory } from './dialog-new-category';
import { useRealtimeCategory } from '@/hooks/use-realtime-supabase-category';
export type Category = {
  categories_id: string;
  name: string;
  description: string;
  created_at: string;
  slug: string;
};

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div
          className=' px-6 py-4 cursor-pointer select-none flex items-center gap-2 font-semibold text-gray-700'
          onClick={() => column.toggleSorting()}
        >
          Category
          {{
            asc: <ArrowUp className='w-4 h-4' />,
            desc: <ArrowDown className='w-4 h-4' />,
          }[column.getIsSorted() as string] ?? null}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className='capitalize p-2 px-6 py-4 font-semibold text-gray-700 '>
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: () => <div className='px-6 '>Description</div>,
    cell: ({ row }) => (
      <div className='lowercase px-6 py-4 text-gray-700  '>
        {row.getValue('description')}
      </div>
    ),
  },
  {
    header: () => <div className='text-center  px-6 py-4 '>Actions</div>,
    id: 'actions',
    enableHiding: false,
    cell: ActionsCell,
  },
];

export function CategoriesTable() {
  const { data } = useRealtimeCategory();

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
      updateCategory: async (categoryId: string, data: any) => {
        await supabase
          .from('categories')
          .update(data)
          .eq('categories_id', categoryId);
      },
    },
  });

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
      <div className=' w-full'>
        <div className='border-collapse max-w-3xl mx-auto rounded-lg mt-10'>
          <table className='w-full'>
            <thead className='bg-gray-100'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-left'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className='font-semibold text-gray-700'
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
                    const id = row.original.categories_id;
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
}

const TR = ({ row }: { row: Row<Category> }) => {
  const router = useRouter();
  const isPresent = useIsPresent();
  return (
    <motion.tr
      className=' hover:bg-gray-50 w-full '
      layout
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
        <td
          key={cell.id}
          className='cursor-pointer w-1/3'
          onClick={() => {
            router.push(`/categories/${row.original.slug}`);
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </motion.tr>
  );
};
