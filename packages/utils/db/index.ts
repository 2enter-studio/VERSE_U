import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const {
  PUBLIC_DEVELOPING,
  PUBLIC_LOCAL_SUPA_URL,
  PUBLIC_SUPA_PROJ_ID,
  LOCAL_SUPA_SERVICE_KEY,
  REMOTE_SUPA_SERVICE_KEY
} = process.env;

const developing = PUBLIC_DEVELOPING === '1';

const url = developing ? PUBLIC_LOCAL_SUPA_URL : `https://${PUBLIC_SUPA_PROJ_ID}.supabase.co`;
const key = developing ? LOCAL_SUPA_SERVICE_KEY : REMOTE_SUPA_SERVICE_KEY;

const admin = createClient(url ?? '', key ?? '');
export { admin };
