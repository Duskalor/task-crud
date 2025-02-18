import { createClient } from '@/utils/supabase/server';
import { Params } from 'next/dist/server/request/params';
import React from 'react';
import { TaskTable } from './components/TaskTable';

//@next-codemod-ignore
export default async function Page({ params }: { params: Params }) {
  const { categories_id } = await params;
  console.log(categories_id);
  if (!categories_id) return <div>No categories_id found</div>;
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from('task')
    .select('*, status(*)')
    .eq('categories_id', categories_id);

  if (!tasks) return <div>No tasks found</div>;
  return <TaskTable tasks={tasks} categories_id={String(categories_id)} />;
}
