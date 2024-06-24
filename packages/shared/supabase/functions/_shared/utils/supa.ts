import { createClient } from '@supabase/supabase-js';

// DB client
function makeSupaClient(
  role: 'admin' | 'anon',
  getEnv: (key: string) => string = (key: string) => process.env[key] ?? ''
) {
  const developing = getEnv('DEVELOPING') === '1';
  const prefix = developing ? 'LOCAL_' : '';
  const url = getEnv(`${prefix}SUPABASE_URL`);
  const key =
    role === 'admin'
      ? getEnv(`${prefix}SUPABASE_SERVICE_ROLE_KEY`)
      : getEnv(`${prefix}SUPABASE_ANON_KEY`);
  return createClient(url, key);
}

export { makeSupaClient };
