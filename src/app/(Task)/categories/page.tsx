import React from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchCategories } from '@/utils/getCategories';
import { CategoriesTable } from './components/categories-table';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <section className='h-full'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoriesTable />
      </HydrationBoundary>
    </section>
  );
}
