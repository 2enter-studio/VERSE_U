import { db, loadMLTexts, loadTables } from '@/server/db';
import { type Action, type Actions } from '@sveltejs/kit';
import { ALL_TABLE_NAMES, type AllTableName, type TableName } from '@/config';
import validator from 'validator';
import pluralize from 'pluralize';

function makeFormDataResponse(
	type: 'success' | 'error' = 'success',
	message: string,
	detail?: string,
	data?: any
): FormDataResponse {
	return { type, message, detail, data };
}

export const load = async () => {
	const tables = loadTables();
	const ml_texts = await loadMLTexts();
	return { tables, ml_texts };
};

const create: Action = async ({ request }) => {
	const formData = await request.formData();
	const tableName = formData.get('table') as TableName;
	const data = formData.get('data') as string;

	if (!ALL_TABLE_NAMES.includes(tableName)) {
		return makeFormDataResponse('error', `invalid table name ${tableName}`);
	}

	if (data) {
		if (!validator.isJSON(data)) {
			return makeFormDataResponse('error', `invalid init data ${data}`);
		}
	}

	const { data: result, error } = await db
		.from(tableName)
		.insert(JSON.parse(data) ?? {})
		.select('id')
		.returns<{ id: string }[]>()
		.single();

	if (error) return makeFormDataResponse('error', `failed to create ${tableName}`, error.message);

	return makeFormDataResponse(
		'success',
		`inserted 1 row into ${tableName}`,
		`- row id: ${result.id}`,
		{ id: result.id }
	);
};

const update: Action = async ({ request }) => {
	const formData = await request.formData();
	const tableName = formData.get('table') as TableName;
	const data = formData.get('data') as string;
	const id = formData.get('id') as string;

	if (!ALL_TABLE_NAMES.includes(tableName) || !validator.isUUID(id) || !validator.isJSON(data)) {
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
	if (!ALL_TABLE_NAMES.includes(tableName) || !validator.isUUID(id)) {
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

const junction: Action = async ({ request, fetch }) => {
	const formData = await request.formData();
	const data = formData.get('data') as string;
	const base = formData.get('base') as TableName;
	const target = formData.get('target') as TableName;

	const baseColumnName = pluralize.singular(base);
	const targetColumnName = pluralize.singular(target);
	const junctionName = `j-${base}-${target}` as AllTableName;

	if (!ALL_TABLE_NAMES.includes(junctionName) || !validator.isJSON(data)) {
		return makeFormDataResponse(
			'success',
			`invalid data or junction name`,
			`- base: ${base}<br/>- junction: ${junctionName}`
		);
	}

	const { selected, id } = JSON.parse(data) as { selected: string[]; id: string };

	let oldIds: string[] = [];
	{
		const { data: result, error } = await db
			.from(junctionName)
			.select(targetColumnName)
			.eq(baseColumnName, id)
			.returns<Record<string, string>[]>();
		if (error) {
			return makeFormDataResponse(
				'error',
				`can not find old junction set of ${junctionName}`,
				error.message
			);
		}
		oldIds = result.map((d) => d[targetColumnName]);
	}

	const createIds = selected.filter((i) => !oldIds.includes(i));
	const deleteIds = oldIds.filter((i) => !selected.includes(i));

	if (createIds.length > 0) {
		const { error } = await db
			.from(junctionName)
			.insert(createIds.map((i) => ({ [baseColumnName]: id, [targetColumnName]: i })));
		if (error) {
			return makeFormDataResponse('error', 'failed to create junctions', error.message);
		}
	}

	if (deleteIds.length > 0) {
		const { error } = await db
			.from(junctionName)
			.delete()
			.filter(baseColumnName, 'eq', id)
			.in(targetColumnName, deleteIds);
		if (error) {
			return makeFormDataResponse('error', 'failed to delete junctions', error.message);
		}
	}

	return makeFormDataResponse(
		'success',
		`success update multi ref of ${base}->${target}`,
		`- id: ${id}<br/>- created: ${createIds.join(',')}<br/>- deleted: ${deleteIds.join(',')}`
	);
};

const actions: Actions = { create, update, remove, junction };

export { actions };
