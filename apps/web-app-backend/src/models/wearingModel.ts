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

export const getMeshes = async () => {
  return await supabase.from('meshes').select('*, body_parts(*)');

  // gameState.meshes = meshes as Mesh[];
};

export const getWearings = async () => {
  const resp = await supabase
    .from('wearings')
		.select('*, category(*), texture_types(*)')
		.eq('enabled', true);
  return resp;

  // if (error) return createError('FAILED_TO_LOAD_DATA');

  // const wearingTypes: Tables<'wearing_types'>[] = [];
  // for (const { category } of wearings) {
  //   if (!wearingTypes.some((r) => r.id === category.id)) {
  //     wearingTypes.push(category);
  //   }
  // }

  // const promises: Promise<void>[] = [];

  // await Promise.all(promises);

  // gameState.wearingTypes = await assignMLTexts(wearingTypes, ['name', 'description'] as const);
  // gameState.wearings = (await assignMLTexts(wearings, [
  //   // 'name',
  //   'description'
  // ] as const)) as Wearing[];
  // gameState.wearings = wearings as Wearing[];
};

export const getOwnedWearings = async (user_id: string) => {
  // const user_id = authState.user?.id;
  // if (!user_id) return createError('USER_NOT_FOUND');
  return await supabase
    .from('owned_wearings')
    .select('wearing, equipped')
    .eq('owner', user_id)
    .eq('equipped', true)
		.returns<{ wearing: string }[]>();
  // if (error) return createError('FAILED_TO_LOAD_DATA');

  // gameState.owned_wearings = data.map(({ wearing, equipped }) => {
  //   return {
  //     id: wearing,
  //     equipped
  //   };
  // }) as OwnedWearing[];
};

export const insertOwnedWearings = async (userId: string, wearingId: string) => {
  return await supabase
    .from('owned_wearings')
    .insert({ wearing: wearingId, owner: userId })
    .select('wearing, equipped')
    .returns<{ wearing: string; equipped: boolean }[]>()
    .single();
};

export const getStarterPack = async () => {
  return await supabase.from('wearings').select('*').eq('in_starter_pack', true).returns<{ id: string }[]>();
};

export const insertStarterPack = async (data: { id: string }[]) => {
  return await supabase.from('owned_wearings').upsert(data);
};

export const equipWearings = async (userId: string, wearingIds: string[]) => {
  return await supabase.from('owned_wearings').update({ equipped: true }).eq('owner', userId).in('wearing', wearingIds);
};

export const unequipWearings = async (userId: string, wearingIds: string[]) => {
  return await supabase.from('owned_wearings').update({ equipped: false }).eq('owner', userId).in('wearing', wearingIds);
};
