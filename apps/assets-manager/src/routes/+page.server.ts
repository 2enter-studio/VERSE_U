import { createRow, loadMLTexts, loadTables } from '@/server/db';
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

	const result = await createRow(tableName);
	if ('error' in result) return { message: 'something went wrong' };
	console.log(result.id);
};

const update: Action = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	console.log(data);
};

const remove: Action = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	const { tableName, id } = data;

	console.log(data);
};

const actions: Actions = { create, update, remove };

export { actions };
