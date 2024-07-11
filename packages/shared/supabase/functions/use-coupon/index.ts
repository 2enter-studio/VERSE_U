import { corsHeaders } from '../_shared/cors.ts';
import { admin, validateUser } from '../_shared/db.ts';
import { createError, createSuccess } from '../_shared/response.ts';
import validator from 'validator';
import { COUPON_LIMITS } from '../config.ts';

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
  const sponsor_id = body.sponsor_id as string;
  if (!sponsor_id) return createError('received no sponsor id');
  if (!validator.isUUID(sponsor_id)) return createError('invalid sponsor ID', { status: 500 });

  const { data, error } = await admin
    .from('sponsors')
    .select('value,coupons(count)')
    .eq('id', sponsor_id)
    .returns<{ value: keyof typeof COUPON_LIMITS; coupons: { count: number } }[]>()
    .single();

  if (error) return createError('invalid sponsor ID', { status: 500 });

  const { value, coupons } = data;
  if (coupons.count >= COUPON_LIMITS[value]) {
    return createError('this coupon is sold out', { status: 500 });
  }

  {
    const { error } = await admin.from('coupons').insert({
      user: user.id,
      sponsor: sponsor_id,
      used: true
    });
    if (error) return createError(error.message, { status: 500 });
  }

  return createSuccess({ success: true });
});
