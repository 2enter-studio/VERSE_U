import sha256 from 'sha256';
import moment from 'moment';

import { corsHeaders } from '../_shared/cors.ts';
import { validateUser } from '../_shared/db.ts';
import { createError, createSuccess } from '../_shared/response.ts';
import { admin } from '../_shared/db.ts';

const key = '12345';

// @ts-ignore
Deno.serve(async (req) => {
	// handle preflight request
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	// validate user
	const user = await validateUser(req);
	if (!user) return createError('invalid auth token');

	// get passcode from request body
	const body = await req.json();
	const passcode = body.passcode as string;

	const now = moment().format('YYYY-MM-DD HH');
	const correctCode = sha256(now + key)
		.slice(0, 5)
		.toUpperCase();

	// const success = passcode.toUpperCase() === correctCode;
	const success = true;

	if (!success) {
		return createError(`psych, that's the wrong number, (The right one is: ${correctCode})`);
	}

	const { error } = await admin.from('hai_an_players').insert({
		player: user.id
	});
	if (error) return createError(error.message, { status: 500 });
	return createSuccess({ message: 'success' });
});
