import { page } from '$app/stores';
import { get } from 'svelte/store';

import type { PageData } from '../routes/$types';
import { LOCALES, type TableName } from '@/config';

function getRowName(row: { id: string; value?: string }) {
	const texts = (get(page).data as PageData).ml_texts?.filter(
		(ml_text) => ml_text.row_id === row.id && ml_text.column_name === 'name'
	);

	if (texts.length > 0)
		return LOCALES.map((locale) => texts.find((text) => text.locale === locale))
			.map((t) => t?.value)
			.join('/');
	return (row as { value?: string })?.value ?? '?????????';
}

export { getRowName };
