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
import React, { useState } from 'react';
import { DialogEditTask } from './dialog-edit-task';
import { Task } from '@/types/Task';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface Props {
  row: { original: Task };
}

export const ActionsCell = ({ row }: Props) => {
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
    <div className='relative flex justify-center'>
      <Dialog open={open} onOpenChange={setOpen}>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
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
          <AlertDialogDelete deleteAction={handleDelete} text='task' />
        </AlertDialog>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogEditTask
          open={open}
          task={row.original}
          setclose={() => setEditDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};
