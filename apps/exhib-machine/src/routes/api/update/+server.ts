import { json } from '@sveltejs/kit';
import moment from 'moment/moment';
import { getUpdated, loadMetaData } from '@/server/metadata';
import { downloadUpdated } from '@/server/download';
import { metadata } from '@/server/state';
import { deepClone } from '@repo/utils';
import config from '@/config';

const { EMPTY_METADATA } = config;

async function update() {
	await loadMetaData();
	const updated = getUpdated();
	if (updated.length > 0) {
		console.log(moment().format('hh:mm:ss'), updated);
		await downloadUpdated(updated);
	}
	metadata.old = deepClone(metadata.new);
	return updated;
}

export const GET = async ({ url }) => {
	const { searchParams } = url;
	const deepUpdate = searchParams.get('force') === 'true';

	if (deepUpdate) {
		metadata.old = deepClone(EMPTY_METADATA);
	}

	const updated = await update();
	return json(updated);
};
