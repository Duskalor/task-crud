import React from 'react';
import { DataTableDemo } from '../Table';
import { createClient } from '@/utils/supabase/server';

const page = async () => {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*');
  if (error) console.log(error);
  if (!categories) return <div>No categories found</div>;
  return (
    <section>
      <DataTableDemo categories={categories} />
    </section>
  );
};

export default page;
