import { supabase } from '@/utils/supabase';

export const invokeHaiAnRoad = async (body: Record<string, unknown>) => {
  return await supabase.functions.invoke('hai-an-road', {
    body
  });
};

export const invokeUseCoupon = async (body: Record<string, unknown>) => {
  return await supabase.functions.invoke('use-coupon', {
    body
  });
};
