import { makeSupaClient } from './index.ts';

function getEnv(key: string) {
  // @ts-ignore
  return Deno.env.get(key);
}

const client = makeSupaClient('anon', getEnv);
const admin = makeSupaClient('admin', getEnv);

async function validateUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');

  const {
    data: { user },
    error
  } = await client.auth.getUser(token);

  if (error) {
    console.error(error);
    return null;
  }

  return user;
}

export { admin, client, validateUser };
