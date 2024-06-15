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

async function loadMLTexts() {
	const { data, error } = await admin.from('ml_texts').select('*').returns<Tables<'ml_texts'>[]>();
	if (error) return [];
	return data;
}

async function createRow(tableName: TableName) {
	const { data, error } = await admin.from(tableName).insert({}).select('id').returns<{id: string}[]>().single()
	if (error) return { error };
	return data
}

export { admin as db, loadTables, loadMLTexts, createRow };
