import { db as supabase } from "../utils/supabaseClient.ts";

export const getMaintenance = async () => {
  return await supabase
    .from('maintenance')
    .select()
    .limit(1)
    .single();
};

export const getAppVersion = async () => {
  return await supabase
    .from('app_versions')
    .select()
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
};

export const getSponsors = async (user_id?: string) => {
  // const user_id = authState.user?.id;
  // if (!user_id) return createError('USER_NOT_FOUND');
  return await supabase.from('sponsors').select('*,coupons(*),sponsor_wearings(wearing)');

  // if (error) return createError('FAILED_TO_LOAD_DATA');

  // gameState.sponsors = await assignMLTexts(data, ['name', 'coupon_info'] as const);
};

export const getRegions = async () => {
  return await supabase
    .from('regions')
    .select('*')
    .eq('enabled', true);
  // if (error) return createError('FAILED_TO_LOAD_DATA');
  // gameState.regions = await assignMLTexts(data, ['name', 'description'] as const);
};

export const getPeopleNearBy = async (user_id: string, trip: Trip) => {
  // const user_id = authState.user?.id;
  // if (!user_id) return createError('USER_NOT_FOUND');
  // if (!gameState.trip) return createError('TRIP_NOT_FOUND');

  // const { trip } = gameState;
  // if (new Date(trip.arrive_at).getTime() > new Date().getTime()) {
  //   console.log('you have not arrived');
  //   gameState.peopleNearBy = [];
  //   return;
  // }

  return await supabase
    .from('trips')
    .select('user(*)')
    .lt('arrive_at', new Date().toISOString())
    .eq('to', trip.to)
    .neq('user', user_id)
    .limit(10);

  // if (error) return createError('FAILED_TO_LOAD_DATA');

  // const result = data.filter((row) => row.user);

  // gameState.peopleNearBy = result.map((row) => row.user);
};

export const getBlockUsers = async () => {
  return await supabase.from('block_users').select();
  // if (error) return createError('FAILED_TO_LOAD_DATA');
  // gameState.block_users = data;
};

export const blockUser = async (args: Record<string, unknown>) => {
  return await supabase
    .from('block_users')
    .insert(args)
    .select()
    .returns<Tables<'block_users'>>();
};

export const getMLTexts = async (row_ids: string[], column_names: string[], locale: string) => {
  return await supabase.from('ml_texts')
		.select('*')
		.in('row_id', row_ids)
		.in('column_name', column_names)
		.eq('locale', locale)
		.returns<Tables<'ml_texts'>[]>();
};
