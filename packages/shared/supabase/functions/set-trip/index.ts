import { corsHeaders } from '../_shared/cors.ts';
import { admin, validateUser } from '../_shared/db.ts';
import { createError, createSuccess } from '../_shared/response.ts';
import { getRegions } from '../_shared/region.ts';
import { getTripByUserId } from '../_shared/trip.ts';
import { genNextTrip, tripReady } from '../_shared/utils/index.ts';

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
  const option = body.option as 0 | 1;
  if (![0, 1].includes(option)) return createError('invalid option');

  const regions = await getRegions();
  if (!regions) return createError('failed to load regions');

  // get current trip
  console.log(`Processing request made by user ${user.id}`);
  const trip = await getTripByUserId(user.id);
  if (!trip) return createError(`failed to load trip of user ${user.id}`);

  // check if trip's arrive_at is less than 10 minutes from now, if not, return error
  if (!tripReady(trip)) return createError('cannot start new trip yet');

  // generate new trip
  const nextTrip = genNextTrip(trip, regions, option);
  console.log(nextTrip);

  // update current trip
  const { error } = await admin.from('trips').update(nextTrip).eq('id', trip.id);

  if (error) {
    return createError(error.message, { status: 500 });
  }

  return createSuccess({ nextTrip });
});
