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
import { useEffect, useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim(),
});

export function DialogNewCategory() {
  const [open, setopen] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCategory = Object.fromEntries(formData.entries());
    const result = schema.safeParse(newCategory);
    try {
      if (result.success) {
        await supabase
          .from('categories')
          .insert({
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

  return (
    <Dialog open={open} onOpenChange={setopen}>
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
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
