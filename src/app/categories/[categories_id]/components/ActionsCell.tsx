import { AlertDialogDelete } from '@/components/alert-dialog-delete';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';

interface Props {
  row: { original: { task_id: string } };
}

export const ActionsCell = ({ row }: Props) => {
  const { task_id } = row.original;
  const handleDelete = async () => {
    const { error } = await supabase
      .from('task')
      .delete()
      .eq('task_id', task_id);
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
