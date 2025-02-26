import { createClient } from '@/utils/supabase/server';
import React from 'react';
import { TaskTable } from './components/task-table';

export default async function Page({
  params,
}: {
  params: Promise<{ categories_id: string }>;
}) {
  const { categories_id } = await params;
  if (!categories_id) throw new Error('No categories_id found');
  const supabase = await createClient();
  try {
    const [categoryResponse, tasksResponse, statusResponse] = await Promise.all(
      [
        supabase
          .from('categories')
          .select('*')
          .eq('categories_id', categories_id)
          .single(),

        supabase
          .from('task')
          .select('*, status(*)')
          .eq('categories_id', categories_id)
          .order('created_at', { ascending: true }),

        supabase.from('status').select('*'),
      ]
    );

    const { data: category, error: errorCategories } = categoryResponse;
    const { data: tasks, error: errorTasks } = tasksResponse;
    const { data: status, error: errorStatus } = statusResponse;

    if (errorCategories) throw new Error('Error fetching category');
    if (errorTasks) throw new Error('Error fetching tasks');
    if (errorStatus) throw new Error('Error fetching status');

    const statusOptions = status.map((statusItem) => ({
      name: statusItem.name,
      id: statusItem.status_id,
    }));

    return (
      <TaskTable
        categoriesName={category.name}
        tasks={tasks}
        categories_id={categories_id}
        status={statusOptions}
      />
    );
  } catch (error) {
    console.error(error);
    return <div>An error occurred while fetching data</div>;
  }
}
