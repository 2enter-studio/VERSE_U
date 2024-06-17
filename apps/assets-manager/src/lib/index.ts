import { page } from '$app/stores';
import { get } from 'svelte/store';

import type { PageData } from '../routes/$types';
import { LOCALES } from '@/config';

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

async function blobToBase64(blob: Blob) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

export { getRowName, blobToBase64 };
