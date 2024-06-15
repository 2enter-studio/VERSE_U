import { corsHeaders } from '../_shared/cors.ts';
import { admin, validateUser } from '../_shared/db.ts';
import { createError, createSuccess } from '../_shared/response.ts';
import { loadRegions } from '../_shared/region.ts';
import { tripReady, genNextTrip, getTripByUserId } from '../_shared/trip.ts';

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

	await loadRegions();

	// get current trip
	console.log(`Processing request made by user ${user.id}`);
	const currentTrip = await getTripByUserId(user.id);
	if (!currentTrip) return createError('error fetching current trip');

	// check if trip's arrive_at is less than 10 minutes from now, if not, return error
	if (!tripReady(currentTrip)) return createError('cannot start new trip yet');

	// generate new trip
	const destination = currentTrip[`next_${option}`];
	const nextTrip = genNextTrip(user.id, currentTrip.to, destination);
	console.log(nextTrip);

	// update current trip
	const { error } = await admin.from('trips').update(nextTrip).eq('id', currentTrip.id);

	if (error) {
		return createError(error.message, { status: 500 });
	}

	return createSuccess({ nextTrip });
});

