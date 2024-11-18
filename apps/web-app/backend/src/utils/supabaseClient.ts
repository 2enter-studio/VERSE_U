import { createClient } from "@supabase/supabase-js";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// 讀取環境變數
const { SUPABASE_URL, SUPABASE_ANON_KEY, LOCAL_SUPABASE_URL, LOCAL_SUPABASE_ANON_KEY, DEVELOPING } = config();

export function getEnv(key: string): string {
  const ENVS = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    LOCAL_SUPABASE_URL,
    LOCAL_SUPABASE_ANON_KEY,
    DEVELOPING,
  } as Record<string, string>;
  return ENVS[key];
}

// 創建 Supabase 客戶端
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
