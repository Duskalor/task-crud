import { createClient } from '@/utils/supabase/server';
import { CardList } from './components/CardList';

export default async function Remates() {
  const supabase = await createClient();
  const { data: remates, error } = await supabase.from('Elements').select('*');
  // console.log({ remates, error });
  if (error) <div>An error occurred while fetching data</div>;
  if (!remates) return <div>No data found</div>;

  return <CardList remates={remates} />;
}
