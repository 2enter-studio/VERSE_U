import { db as supabase } from "../utils/supabaseClient.ts";

export const getUserWearings = async (userId: string) => {
  return await supabase
    .from("owned_wearings")
    .select(`
      *,
      wearing:wearings (
        id,
        category,
        mesh,
        enabled
      )
    `)
    .eq("owner", userId);
};

export const toggleWearingStatus = async (wearingId: string, userId: string, equipped: boolean) => {
  return await supabase
    .from("owned_wearings")
    .update({ equipped })
    .eq("id", wearingId)
    .eq("owner", userId)
    .select()
    .single();
};
