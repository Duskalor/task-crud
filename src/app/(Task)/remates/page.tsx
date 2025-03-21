import { createClient } from '@/utils/supabase/server';
import { CardList } from './components/CardList';
import { cleanRemates } from '@/lib/clean-prices';

export default async function Remates() {
  const supabase = await createClient();
  const { data: rawRemates, error: RemateError } = await supabase
    .from('Elements')
    .select('*');

  if (RemateError) <div>An error occurred while fetching data</div>;
  if (!rawRemates) return <div>No data found</div>;

  const { data: prices, error: PricesError } = await supabase
    .from('exchangerate')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1);

  if (PricesError) <div>An error occurred while fetching data</div>;
  if (!prices) return <div>No data found</div>;

  const remates = cleanRemates(rawRemates, prices);
  console.log(remates);
  return <CardList remates={remates} prices={prices[0]} />;
}
