import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from './categories-table';
import { supabase } from '@/utils/supabase/client';

interface Props {
  setopen: () => void;
  category: Category;
}

export function DialogEditCategory({ category, setopen }: Props) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCategory = Object.fromEntries(formData.entries());
    try {
      await supabase
        .from('categories')
        .update(newCategory)
        .eq('categories_id', category.categories_id);
      setopen();
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };

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
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
