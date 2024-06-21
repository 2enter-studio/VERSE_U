import { createClient } from "npm:@supabase/supabase-js@2";

const denoEnv = Deno.env.get("ENV") ?? "production";

console.log(denoEnv);

const isDev = denoEnv === "development";

const sbUrl = isDev
  ? Deno.env.get("LOCAL_SUPABASE_URL")
  : Deno.env.get("SUPABASE_URL");

const anonKey = isDev
  ? Deno.env.get("LOCAL_SUPABASE_ANON_KEY")
  : Deno.env.get("SUPABASE_ANON_KEY");

const serviceKey = isDev
  ? Deno.env.get("LOCAL_SUPABASE_SERVICE_ROLE_KEY")
  : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!sbUrl || !anonKey || !serviceKey) {
  throw new Error("Missing environment variables");
}

const client = createClient(sbUrl, anonKey);
const admin = createClient(sbUrl, serviceKey);

async function validateUser(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);

  if (error) {
    console.error(error);
    return null;
  }

  return user;
}

export { admin, client, validateUser };
