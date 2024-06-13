import { loadMLTexts, loadTables } from '@/server/db';

export const load = async () => {
	const tables = loadTables();
	const ml_texts = await loadMLTexts();
	return { tables, ml_texts };
};
