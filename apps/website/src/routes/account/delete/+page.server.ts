import type { Tables } from '@repo/shared/supatypes';
import { type Action, type Actions, fail } from '@sveltejs/kit';
import { admin } from '$lib/server/db';

const remove: Action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const public_id = formData.get('public_id') as string;

  const { data, error } = await admin.auth.signInWithPassword({ email, password });

  if (error) return fail(400, { error: error.message });

  const { user } = data;

  {
    const { error } = await admin
      .from('profiles')
      .select('*')
      .eq('public_id', public_id.toUpperCase())
      .returns<Tables<'profiles'>[]>()
      .single();

    if (error) return fail(400, { error: error.message });
  }

  {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) return fail(400, { error: error.message });
  }
};

export const actions: Actions = { remove };
