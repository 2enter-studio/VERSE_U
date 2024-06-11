import { admin } from '@repo/utils/db';
import type { Tables } from '@repo/supabase';
import { TABLE_NAMES, type TableName } from '@/config';

async function loadTables() {
	const tables: any = {};
	for (const table of TABLE_NAMES) {
		let result: any[];
		const { data, error } = await admin.from(table).select('*').returns<Tables<typeof table>[]>();
		if (error) result = [];
		if (data) result = data;
		else {
			result = [];
		}

		tables[table] = result;
	}

	return tables as Record<TableName, Tables<TableName>[]>;
}

export { admin as db, loadTables };
