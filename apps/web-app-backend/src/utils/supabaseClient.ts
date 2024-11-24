import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  LOCAL_SUPABASE_URL,
  LOCAL_SUPABASE_ANON_KEY,
  DEVELOPING,
} = process.env;

export function getEnv(key: string): string {
  const ENVS: Record<string, string | undefined> = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    LOCAL_SUPABASE_URL,
    LOCAL_SUPABASE_ANON_KEY,
    DEVELOPING,
  };
  return ENVS[key] || "";
}

export function makeSupaClient() {
  const isDeveloping = getEnv("DEVELOPING") === "1";
  const url = isDeveloping ? getEnv("LOCAL_SUPABASE_URL") : getEnv("SUPABASE_URL");
  const key = isDeveloping ? getEnv("LOCAL_SUPABASE_ANON_KEY") : getEnv("SUPABASE_ANON_KEY");

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, key);
}

export const db = makeSupaClient();
