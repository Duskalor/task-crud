import { InputError } from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase/client';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim(),
});

export function DialogNewTask({ categories_id }: { categories_id: string }) {
  const [open, setopen] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries(formData.entries());
    const result = schema.safeParse(newTask);
    try {
      if (result.success) {
        await supabase.from('task').insert({
          ...result.data,
          categories_id,
          status_id: 'df283882-7858-43db-a9dc-d46d4669977c',
        });
        setopen(false);
      } else {
        setError('error the create task');
        setDisabled(false);
      }
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setopen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setopen(open);
        setDisabled(false);
        setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant='default'>New task</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle> New task</DialogTitle>
          <DialogDescription>
            Create a new task to organize your tasks.
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
            />
          </div>
          {error && <InputError message={error} />}
          <DialogFooter>
            <Button disabled={disabled} type='submit'>
              {!disabled ? (
                'Save changes'
              ) : (
                <LoaderCircleIcon className='animate-spin' />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
