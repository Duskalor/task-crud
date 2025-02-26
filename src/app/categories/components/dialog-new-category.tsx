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
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DialogNewCategory() {
  const [open, setopen] = useState(false);
  const navigate = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCategory = Object.fromEntries(formData.entries());
    // console.log(newCategory);
    try {
      const response = await fetch('api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error('Error saving category');
      }

      const data = await response.json();
      console.log(data);
      setopen(false);
      navigate.push('/');
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };

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
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
