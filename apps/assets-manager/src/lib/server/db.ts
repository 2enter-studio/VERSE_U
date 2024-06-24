import 'dotenv/config';
import { makeSupaClient } from '@repo/shared/utils';
import type { Tables } from '@repo/shared/supatypes';
import { type BucketName, TABLE_NAMES, type TableName } from '@/config';

const admin = makeSupaClient('admin');

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

async function getFile(bucket: BucketName, filename: string) {
	const { data, error } = await admin.storage.from(bucket).download(filename);
	if (error) {
		return null;
		// throw new Error('Error while downloading image: ' + error.message);
	}
	return data;
}

export { admin, loadTables, loadMLTexts, getFile };
