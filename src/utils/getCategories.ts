import { createClient } from './supabase/server';

export const fetchCategories = async () => {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*');
  return data || [];
};
