import { admin } from './db.ts';
import type { Tables } from '../types.ts';

async function getRegions() {
  const { data, error } = await admin
    .from('regions')
    .select()
    .eq('enabled', true)
    .returns<Tables<'regions'>[]>();
  if (error) {
    console.error(error);
  }
  return data ?? [];
}

export { getRegions };
