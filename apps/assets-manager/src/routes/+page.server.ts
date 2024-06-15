import { db, loadMLTexts, loadTables } from '@/server/db';
import type { Action, Actions } from '@sveltejs/kit';
import { TABLE_NAMES, type TableName } from '@/config';

export const load = async () => {
	const tables = loadTables();
	const ml_texts = await loadMLTexts();
	return { tables, ml_texts };
};

const create: Action = async ({ request }) => {
	const formData = await request.formData();
	const tableName = formData.get('table') as TableName;

	if (!TABLE_NAMES.includes(tableName)) {
		return { message: 'invalid table name' };
	}

	const { data, error } = await db
		.from(tableName)
		.insert({})
		.select('id')
		.returns<{ id: string }[]>()
		.single();
	if (error) return { error };

	console.log(data.id);
};

const update: Action = async ({ request }) => {
	const formData = await request.formData();
	const tableName = formData.get('table') as TableName;
	const data = formData.get('data');
	const id = formData.get('id');
	if (!TABLE_NAMES.includes(tableName) || !data || !id) return;

	const { data: result, error } = await db
		.from(tableName)
		.update(data)
		.eq('id', id)
		.select('*')
		.single();
	if (error) return { error };

	console.log(data);
};

const remove: Action = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	const tableName = formData.get('table') as TableName;
	const id = formData.get('id') as string;
	if (!TABLE_NAMES.includes(tableName) || !id) return { message: 'invalid data' };

	const { data: result, error } = await db.from(tableName).delete().eq('id', id);
	if (error) return { error };
	return data;
};

const actions: Actions = { create, update, remove };

export { actions };
