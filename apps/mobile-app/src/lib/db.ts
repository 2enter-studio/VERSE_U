import {
	LOCAL_SUPABASE_ANON_KEY,
	LOCAL_SUPABASE_URL,
	SUPABASE_ANON_KEY,
	SUPABASE_URL,
	DEVELOPING
} from '$env/static/public';
import { makeSupaClient } from '@repo/config/utils';

function getEnv(key: string) {
	const ENVS = {
		LOCAL_SUPABASE_URL,
		SUPABASE_ANON_KEY,
		SUPABASE_URL,
		LOCAL_SUPABASE_ANON_KEY,
		DEVELOPING
	} as Record<string, string>;
	return ENVS[key];
}

const db = makeSupaClient('anon', getEnv);

export { db };
