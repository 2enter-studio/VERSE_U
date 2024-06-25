import { db } from '@/db';
import { sysState } from '@/states';

async function getMLTexts(row_ids: string[], column_names: string[]) {
	const { data, error } = await db
		.from('ml_texts')
		.select('*')
		.in('row_id', row_ids)
		.in('column_name', column_names)
		.eq('locale', sysState.locale)
		.returns<{ value: string; row_id: string; column_name: string }[]>();
	if (error) {
		// console.error(error.message);
		return [];
	}
	return data;
}

async function assignMLTexts<T extends any[], P extends string[]>(data: T, column_names: P) {
	const mlTexts = await getMLTexts(
		data.map((d) => d.id),
		column_names
	);

	for (const d of data) {
		for (const column_name of column_names) {
			d[column_name] =
				mlTexts.find((m) => m.row_id === d.id && m.column_name === column_name)?.value ?? '';
		}
	}

	return data as (T[number] & Record<P[number], string>)[];
}

function getTextFromObj(obj: Record<string, any>[], column_name: string, id: string) {
	if (!obj) return '';
	if (obj.length === 0) return '';
	return obj.find((o) => o.id === id)?.[column_name] ?? '';
}

export { assignMLTexts, getTextFromObj };
