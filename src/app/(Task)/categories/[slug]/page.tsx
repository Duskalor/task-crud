import { createClient } from '@/utils/supabase/server';
import React from 'react';
import { TaskTable } from './components/task-table';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) throw new Error('No slug found');
  const supabase = await createClient();
  try {
    const { data: category, error: errorCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (errorCategories) throw new Error('Error fetching category');
    const [tasksResponse, statusResponse] = await Promise.all([
      supabase
        .from('task')
        .select('*, status(*)')
        .eq('categories_id', category.categories_id)
        .order('created_at', { ascending: true }),

      supabase.from('status').select('*'),
    ]);

    const { data: tasks, error: errorTasks } = tasksResponse;
    const { data: status, error: errorStatus } = statusResponse;

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
        categories_id={category.categories_id}
        status={statusOptions}
      />
    );
  } catch (error) {
    console.error(error);
    return <div>An error occurred while fetching data</div>;
  }
}
