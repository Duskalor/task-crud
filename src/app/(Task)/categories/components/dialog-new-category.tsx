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

export function DialogNewCategory() {
  const [open, setopen] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    const formData = new FormData(event.currentTarget);
    const newCategory = Object.fromEntries(formData.entries());
    const result = schema.safeParse(newCategory);
    try {
      if (result.success) {
        await supabase.from('categories').insert({
          ...result.data,
          slug: result.data.name.toLowerCase().replaceAll(' ', '-'),
        });
        setopen(false);
      } else {
        setError('error al crear la categoría');
      }
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setDisabled(false);
        setopen((open) => !open);
        setError(null);
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
        <Button variant='default'>New category</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle> New category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='category' className='text-right'>
              Category
            </Label>
            <Input
              id='category'
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
