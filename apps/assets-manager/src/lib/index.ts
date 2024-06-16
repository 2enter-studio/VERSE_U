import { page } from '$app/stores';
import { get } from 'svelte/store';

import type { PageData } from '../routes/$types';
import type { Tables } from '@repo/supabase';
import type { TableName } from '@/config';

function getRowName(row: Tables<TableName>) {
	const texts = (get(page).data as PageData).ml_texts
		?.filter((ml_text) => ml_text.row_id === row.id && ml_text.column_name === 'name')
		?.map((texts) => texts.value);
	if (texts.length > 0) return texts.join('/');
	return (row as { value?: string })?.value ?? '?????????';
}

export { getRowName };
