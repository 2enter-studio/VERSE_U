import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const denoEnv = Deno.env.get('DENO_ENV') ?? 'production';

const sbUrl =
	// @ts-ignore
	(denoEnv === 'development' ? Deno.env.get('LOCAL_SUPABASE_URL') : Deno.env.get('SUPABASE_URL')) ??
	'';
const sbKey =
	(denoEnv === 'development'
		? // @ts-ignore
			Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY')
		: // @ts-ignore
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) ?? '';

export const admin = createClient(sbUrl, sbKey);
