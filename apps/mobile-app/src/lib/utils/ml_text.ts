import { db } from '@/db';
import { general } from '@/stores';

async function getMLText(row_id: string, column_name: string) {
	const { data, error } = await db
		.from('ml_texts')
		.select('value')
		.eq('row_id', row_id)
		.eq('column_name', column_name)
		.eq('locale', general.locale)
		.returns<{ value: string }[]>()
		.single();

	if (error) {
		// console.error(error.message);
		return '';
	}
	return data.value;
}

async function getMLTexts(row_ids: string[], column_names: string[]) {
	const { data, error } = await db
		.from('ml_texts')
		.select('*')
		.in('row_id', row_ids)
		.in('column_name', column_names)
		.eq('locale', general.locale)
		.returns<{ value: string; row_id: string; column_name: string }[]>();
	if (error) {
		// console.error(error.message);
		return [];
	}
	return data;
}

async function assignMLTexts<T extends any[]>(
	data: T,
	column_names: string[] = ['name', 'description']
) {
	const mlTexts = await getMLTexts(
		data.map((d) => d.id),
		column_names
	);
	if (mlTexts.length === 0) return data;

	for (const d of data) {
		for (const column_name of column_names) {
			d[column_name] = mlTexts.find(
				(m) => m.row_id === d.id && m.column_name === column_name
			)?.value;
		}
	}

	return data;
}

function getTextFromObj(obj: { [key in string]: any }[], column_name: string, id: string) {
	if (!obj) return '';
	if (obj.length === 0) return '';
	return obj.find((o) => o.id === id)?.[column_name] ?? '';
}

export { getMLText, getMLTexts, assignMLTexts, getTextFromObj };
