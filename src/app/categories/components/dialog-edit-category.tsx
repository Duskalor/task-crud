import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from './categories-table';
import { supabase } from '@/utils/supabase/client';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { InputError } from '@/components/input-error';

interface Props {
  category: Category;
  setopen: () => void;
  open: boolean;
}
const schema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim(),
});

export function DialogEditCategory({ open, category, setopen }: Props) {
  const [error, setError] = useState<null | string>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCategory = Object.fromEntries(formData.entries());
    const result = schema.safeParse(newCategory);
    if (!result.success) {
      setError('Category name is required');
      return;
    }
    try {
      await supabase
        .from('categories')
        .update(result.data)
        .eq('categories_id', category.categories_id);
      setopen();
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };
  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  return (
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
            defaultValue={category.name}
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
            defaultValue={category.description}
            autoComplete='off'
          />
        </div>
        {error && <InputError message={error} />}
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
