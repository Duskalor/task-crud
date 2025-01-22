import { createClient } from '@/utils/supabase/server';
import { Params } from 'next/dist/server/request/params';
import React from 'react';

export default async function Page({ params }: { params: Params }) {
  const { categories_id } = await params;
  // console.log(categories_id);
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('categories_id', categories_id);
  console.log(categories);
  return <div>page</div>;
}
