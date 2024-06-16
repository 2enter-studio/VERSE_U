import { db, loadMLTexts, loadTables } from '@/server/db';
import { type Action, type Actions } from '@sveltejs/kit';
import { TABLE_NAMES, type TableName } from '@/config';
import validator from 'validator';

function makeFormDataResponse(
	type: 'success' | 'error' = 'success',
	message: string,
	detail?: string
): FormDataResponse {
	return { type, message, detail };
}

export const load = async () => {
	const tables = loadTables();
	const ml_texts = await loadMLTexts();
	return { tables, ml_texts };
};

const create: Action = async ({ request }) => {
	const formData = await request.formData();
	const tableName = formData.get('table') as TableName;
	const data = formData.get('data');

	if (!TABLE_NAMES.includes(tableName)) {
		return makeFormDataResponse('error', `invalid table name ${tableName}`);
	}

	const { data: result, error } = await db
		.from(tableName)
		.insert(data ?? {})
		.select('id')
		.returns<{ id: string }[]>()
		.single();

	if (error) return makeFormDataResponse('error', `failed to create ${tableName}`, error.message);

	return makeFormDataResponse(
		'success',
		`inserted 1 row into ${tableName}`,
		`- row id: ${result.id}`
	);
};

const update: Action = async ({ request }) => {
	const formData = await request.formData();
	const tableName = formData.get('table') as TableName;
	const data = formData.get('data') as string;
	const id = formData.get('id') as string;

	if (!TABLE_NAMES.includes(tableName) || !validator.isUUID(id) || !validator.isJSON(data)) {
		return makeFormDataResponse(
			'error',
			'invalid data input, id or table name',
			`-table: ${tableName} <br/>- id: ${id} <br/>- data: ${data}`
		);
	}

	const { error } = await db.from(tableName).update(JSON.parse(data)).eq('id', id);

	if (error) return makeFormDataResponse('error', `failed to update ${tableName}`, error.message);

	let formatData = `updated fields: <br/>- id: ${id} <br/>`;
	for (const [key, value] of Object.entries(JSON.parse(data))) {
		formatData += `- ${key}: ${value} <br/>`;
	}

	return makeFormDataResponse('success', `updated 1 row from ${tableName}`, formatData);
};

const remove: Action = async ({ request }) => {
	const formData = await request.formData();
	const tableName = formData.get('table') as TableName;
	const id = formData.get('id') as string;
	if (!TABLE_NAMES.includes(tableName) || !validator.isUUID(id)) {
		return makeFormDataResponse(
			'error',
			'invalid id or table name',
			`-table: ${tableName} <br/>- id: ${id}`
		);
	}

	const { error } = await db.from(tableName).delete().eq('id', id);
	if (error) return makeFormDataResponse('error', `failed to delete ${tableName}`, error.message);
	return makeFormDataResponse('success', `deleted 1 row from ${tableName}`, `- row id: ${id}`);
};

const actions: Actions = { create, update, remove };

export { actions };
