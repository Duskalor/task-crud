import { createClient } from '@/utils/supabase/server';
import { DataTableDemo } from './Table';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*');
  if (error) console.log(error);
  if (!categories) return <div>No categories found</div>;

  console.log(categories);
  return (
    <main className='w-full p-5'>
      <DataTableDemo categories={categories} />
    </main>
  );
}
