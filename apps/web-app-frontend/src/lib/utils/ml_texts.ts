import { sysState } from '@/states';
import * as systemApi from '@/api/system';

async function getMLTexts(row_ids: string[], column_names: string[]) {
	console.log('sysState.pref.locale', sysState.pref.locale);
	const data = await systemApi.getMLTexts(row_ids, column_names, sysState.pref.locale);
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
export { assignMLTexts };
