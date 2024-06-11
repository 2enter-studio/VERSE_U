import { createClient } from '@supabase/supabase-js';

import {
  PUBLIC_DEVELOPING,
  PUBLIC_LOCAL_SUPA_ANON_KEY,
  PUBLIC_LOCAL_SUPA_URL,
  PUBLIC_REMOTE_SUPA_ANON_KEY,
  PUBLIC_SUPA_PROJ_ID
} from '$env/static/public';

const developing = PUBLIC_DEVELOPING === '1';

const url = developing ? PUBLIC_LOCAL_SUPA_URL : `https://${PUBLIC_SUPA_PROJ_ID}.supabase.co`;
const key = developing ? PUBLIC_LOCAL_SUPA_ANON_KEY : PUBLIC_REMOTE_SUPA_ANON_KEY;

export default createClient(url, key);
