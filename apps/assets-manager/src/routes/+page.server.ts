import { admin } from '@repo/utils/db';
import { loadTables } from '@/server/db';

const { data, error } = await admin.from('regions').select('*');
if (error) console.error(error);
console.log(data);

export const load = async () => {
	const tables = await loadTables();
	if ('error' in tables) return {};
	return { tables };
};
