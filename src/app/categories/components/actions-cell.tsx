import { supabase } from '@/utils/supabase/client';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { AlertDialogDelete } from '../../../components/alert-dialog-delete';
import {
  AlertDialog,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DialogEditCategory } from './dialog-edit-category';
import { Category } from './categories-table';

interface Props {
  row: { original: Category };
}

export const ActionsCell = ({ row }: Props) => {
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
    <div
      className='relative flex justify-center'
      onClick={(e) => e.stopPropagation()}
    >
      <Dialog open={open} onOpenChange={setOpen}>
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
              <DropdownMenuItem>
                <DialogTrigger asChild>
                  <span
                    className='w-full'
                    onClick={() => setEditDialogOpen(true)}
                  >
                    Edit
                  </span>
                </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-600 p-0'>
                <AlertDialogTrigger asChild className='p-2'>
                  <span className='w-full'>Delete</span>
                </AlertDialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogDelete deleteAction={handleDelete} text='category' />
        </AlertDialog>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogEditCategory
          category={row.original}
          setopen={() => setEditDialogOpen(false)}
          open={open}
        />
      </Dialog>
    </div>
  );
};
