import fs from 'fs-extra';
import validator from 'validator';
import moment from 'moment';

import { db } from '@/server/db';
import type { BucketName, MetaData } from '@/config';
import { BUCKET_NAMES, EMPTY_METADATA, METADATA_FILE } from '@/config';
import { metadata, serverState } from '@/server/state';

function initMetaData() {
	metadata.old = getMetaDataBackUp();
}

function getMetaDataBackUp() {
	const exist = fs.existsSync(METADATA_FILE);
	if (!exist) {
		return structuredClone(EMPTY_METADATA);
	}
	const data = fs.readFileSync(METADATA_FILE).toString();
	if (validator.isJSON(data)) {
		return JSON.parse(data) as MetaData;
	}
	return structuredClone(EMPTY_METADATA);
}

function setMetaDataBackUp(data: MetaData) {
	fs.writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2));
}

function getUpdated() {
	const result: { table: BucketName; id: string }[] = [];

	for (const table of BUCKET_NAMES) {
		for (const item of metadata.new[table]) {
			const index = metadata.old[table].findIndex((data) => data.id === item.id);
			if (index === -1) {
				result.push({ table, id: item.id });
			} else {
				const updated = metadata.old[table][index].updated_at !== item.updated_at;
				if (updated) {
					console.log(`found something new`);
					result.push({ table, id: item.id });
				}
			}
		}
		serverState.lastUpdated = moment();
	}

	return result;
}

async function loadMetaData() {
	for (const table of BUCKET_NAMES) {
		const { data, error } = await db.from(table).select('*');
		if (error) {
			console.error(error);
			continue;
		}

		if (data) metadata.new[table] = data;
	}

	setMetaDataBackUp(metadata.new);
}

export { loadMetaData, getUpdated, initMetaData };
