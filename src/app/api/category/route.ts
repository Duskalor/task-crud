// import { createClient } from '@/utils/supabase/server';

import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description } = body;
  if (name === '' || description === '')
    return new Response(
      JSON.stringify({ error: 'Missing name or description for category' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .insert([{ name, description }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ message: `Category ${name} created` }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
