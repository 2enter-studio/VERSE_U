import { admin } from './db.ts';
import type { TablesInsert } from '@repo/shared/supatypes';

async function fillStarterPack() {
  const { data, error } = await admin
    .from('profiles')
    .select('user,owned_wearings(wearing)')
    .returns<{ user: string; owned_wearings: { wearing: string }[] }[]>();
  if (error) return { error };

  const { data: wearings } = await admin
    .from('wearings')
    .select('id')
    .eq('in_starter_pack', true)
    .returns<{ id: string }[]>();

  if (!wearings) return { error: 'no wearings found' };

  const wearingIds = wearings.map((w) => w.id);

  for (const person of data) {
    let insertData: TablesInsert<'owned_wearings'>[] = [];
    for (const w_id of wearingIds) {
      if (!person.owned_wearings.some((w) => w.wearing === w_id))
        insertData.push({ wearing: w_id, owner: person.user });
    }
    console.log(insertData);
    const { error } = await admin.from('owned_wearings').upsert(insertData);
    if (error) return { error };
  }
}

export { fillStarterPack };
