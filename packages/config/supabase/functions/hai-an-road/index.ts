import sha256 from 'sha256';
import moment from 'moment';

import { corsHeaders } from '../_shared/cors.ts';
import { validateUser } from '../_shared/db.ts';
import { createError, createSuccess } from '../_shared/response.ts';
import { admin } from '../_shared/db.ts';
import { genHaiAnPasscode } from '../_shared/utils/index.ts';

// @ts-ignore
const key = Deno.env.get('HAI_AN_KEY');

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

	const correctCode = genHaiAnPasscode(key);
	const success = passcode.toUpperCase() === correctCode;
	// const success = true;

	if (!success) {
		return createError(`psych, that's the wrong number, (The right one is: ${correctCode})`);
	}

	const { error } = await admin.from('hai_an_players').insert({
		player: user.id
	});
	if (error) return createError(error.message, { status: 500 });
	return createSuccess({ message: 'success' });
});
