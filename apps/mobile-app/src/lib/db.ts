import { createClient } from '@supabase/supabase-js';
import {
	PUBLIC_LOCAL_SUPABASE_KEY,
	PUBLIC_LOCAL_SUPABASE_URL,
	PUBLIC_SUPABASE_KEY,
	PUBLIC_SUPA_PROJ_ID,
	PUBLIC_NODE_ENV
} from '$env/static/public';

const developing = PUBLIC_NODE_ENV === 'development';

const url = developing ? PUBLIC_LOCAL_SUPABASE_URL : `https://${PUBLIC_SUPA_PROJ_ID}.supabase.co`;
const key = developing ? PUBLIC_LOCAL_SUPABASE_KEY : PUBLIC_SUPABASE_KEY;

const db = createClient(url, key);

export { db, url as dbUrl };
