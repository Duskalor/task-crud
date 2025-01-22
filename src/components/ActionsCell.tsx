import { supabase } from '@/utils/supabase/client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import { AlertDialogDelete } from './alert-dialog-delete';
import { AlertDialog, AlertDialogTrigger } from './ui/alert-dialog';

interface Props {
  row: { original: { categories_id: string } };
}

export const ActionsCell = ({ row }: Props) => {
  const { categories_id } = row.original;
  const handleDelete = async () => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('categories_id', categories_id);
    if (error) {
      console.log(error);
    }
  };
  return (
    <div className='relative'>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-red-600 p-0'>
              <AlertDialogTrigger asChild className='p-2'>
                <span className='w-full'>Delete</span>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogDelete deleteCategory={handleDelete} />
      </AlertDialog>
    </div>
  );
};
