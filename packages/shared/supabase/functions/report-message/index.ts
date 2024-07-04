import { corsHeaders } from '../_shared/cors.ts';
import { admin, validateUser } from '../_shared/db.ts';
import { createError, createSuccess } from '../_shared/response.ts';
import validator from 'validator';
import type { Tables } from '../types.ts';

// @ts-ignore
Deno.serve(async (req) => {
  // handle preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // validate user
  const user = await validateUser(req);
  if (!user) return createError('invalid auth token');

  // get option from request body
  const body = await req.json();
  const message_id = body.message_id as string;
  const reason = body.reason as string;
  if (!validator.isUUID(message_id)) return createError('invalid message ID', { status: 500 });

  const { data, error } = await admin
    .from('chat_messages')
    .select()
    .eq('id', message_id)
    .returns<Tables<'chat_messages'>[]>()
    .single();

  if (error) return createError(error.message, { status: 500 });

  const insertData = {
    reporter: user.id,
    perpetrator: data.sender,
    content: data.content,
    reason,
    message_id: data.id
  };
  {
    const { error } = await admin.from('report_messages').insert(insertData);
    if (error) return createError(error.message, { status: 500 });
  }

  return createSuccess({ success: true });
});
