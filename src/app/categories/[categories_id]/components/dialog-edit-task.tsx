import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/utils/supabase/client';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Task } from '@/types/Task';

const schema = z.object({
  name: z.string(),
  description: z.string(),
});

interface Props {
  task: Task;
  setopen: () => void;
}
export function DialogEditTask({ task, setopen }: Props) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries(formData.entries());
    const result = schema.safeParse(newTask);
    try {
      await supabase
        .from('task')
        .update(result.data)
        .eq('task_id', task.task_id);

      setopen();
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  return (
    <>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle> Edit task</DialogTitle>
          <DialogDescription>
            Edit a task to organize your tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='task' className='text-right'>
              Task
            </Label>
            <Input
              id='task'
              name='name'
              className='col-span-3'
              autoComplete='off'
              defaultValue={task.name}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Input
              id='description'
              name='description'
              className='col-span-3'
              autoComplete='off'
              defaultValue={task.description}
            />
          </div>
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
}
