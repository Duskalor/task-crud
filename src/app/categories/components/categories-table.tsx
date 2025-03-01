'use client';
'use no memo';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ActionsCell } from '@/app/categories/components/actions-cell';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { DialogNewCategory } from './dialog-new-category';
import { useRealtimeCategory } from '@/hooks/use-real-time-category';
export type Category = {
  categories_id: string;
  name: string;
  description: string;
  created_at: string;
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

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const { data } = useRealtimeCategory(categories);

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
      <div className=' w-full  mt-10'>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className=' max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white'
        >
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
            <tbody>
              {table.getRowModel().rows?.length ? (
                <AnimatePresence>
                  {table.getRowModel().rows.map((row, i) => {
                    const id = row.original.categories_id;
                    return (
                      <motion.tr
                        className='border-b hover:bg-gray-50 transition'
                        key={id}
                        layout='position'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
                          <td
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
        </motion.div>
      </div>
    </div>
  );
}
