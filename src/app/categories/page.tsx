import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { CategoriesTable } from './components/categories-table';

const page = async () => {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*');
  if (error) console.log(error);
  if (error) return <div>No categories found</div>;
  return (
    <section className='h-full'>
      <CategoriesTable categories={categories} />
    </section>
  );
};

export default page;
