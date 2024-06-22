import { createClient } from "@supabase/supabase-js";

const denoEnv = Deno.env.get("DENO_ENV") ?? "production";

const sbUrl =
  (denoEnv === "development"
    ? Deno.env.get("LOCAL_SUPABASE_URL")
    : Deno.env.get("SUPABASE_URL")) ?? "";
const sbKey =
  (denoEnv === "development"
    ? Deno.env.get("LOCAL_SUPABASE_SERVICE_ROLE_KEY")
    : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) ?? "";

export const admin = createClient(sbUrl, sbKey);
