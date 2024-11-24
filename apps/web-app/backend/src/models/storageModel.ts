import { db as supabase } from '../utils/supabaseClient.ts';

export const downloadFile = async (bucket: BucketName, filename: string) => {
  const { data, error } = await supabase.storage.from(bucket).download(filename);
  return { data, error };
};


export const getFilePublicUrl = async (bucket: BucketName, filename: string) => {
  return supabase.storage.from(bucket).getPublicUrl(filename);
};
