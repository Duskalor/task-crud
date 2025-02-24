import { createClient } from '@/utils/supabase/server';
import React from 'react';
import { TaskTable } from './components/TaskTable';

export default async function Page({
  params,
}: {
  params: Promise<{ categories_id: string }>;
}) {
  const { categories_id } = await params;
  if (!categories_id) return <div>No categories_id found</div>;
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from('task')
    .select('*, status(*)')
    .eq('categories_id', categories_id);
  // .order('created_at', { ascending: false });

  const { data: status, error } = await supabase.from('status').select('*');

  if (error) return <div>No status found</div>;

  const statusOptions = status.map((status) => ({
    name: status.name,
    id: status.status_id,
  }));

  if (!tasks) return <div>No tasks found</div>;
  return (
    <TaskTable
      tasks={tasks}
      categories_id={String(categories_id)}
      status={statusOptions}
    />
  );
}
