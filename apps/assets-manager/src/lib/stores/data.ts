import type { TableName } from '@/config';
import type { Tables } from '@repo/shared/supatypes';
import { writable } from 'svelte/store';
import type { PageData } from '../../routes/$types';

const tables = writable<{ ml_texts: Tables<'ml_texts'>[]; tables: Tables }>({
	ml_texts: [],
	tables: null
});

function setTables(data: { ml_texts: Tables<'ml_texts'>[]; tables: Tables }) {
	tables.update((tableData) => ({ ...tableData, ...data }));
}

function setTable(tableName: TableName, data: Tables<TableName>, id: string, create: boolean) {
	tables.update((tableData) => ({
		...tableData,
		tables: {
			...tableData.tables,
			[tableName]: create
				? [...tableData.tables[tableName], data]
				: tableData.tables[tableName].map((item) => (item.id === id ? { ...item, ...data } : item))
		}
	}));
}

function setMlTexts(data: Tables<'ml_texts'>[], id: string) {
	tables.update((tableData) => ({
		...tableData,
		ml_texts: tableData.ml_texts.map((ml_text) =>
			ml_text.id === id ? { ...ml_text, ...data } : ml_text
		)
	}));
}

export { tables, setTables, setTable, setMlTexts };
