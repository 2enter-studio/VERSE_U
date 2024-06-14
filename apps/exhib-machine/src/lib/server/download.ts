import fs from 'fs';
import config, { type BucketName } from '@/config';
import { db } from './db';
import chalk from 'chalk';

const { STORAGE_BASE, TEXTURE_TYPES } = config;

function initFileStorage() {
	if (!fs.existsSync(STORAGE_BASE)) {
		fs.mkdirSync(STORAGE_BASE, { recursive: true });
	}
}

async function downloadFile(bucket: BucketName, name: string, saveName = name) {
	const { data: blob, error } = await db.storage.from(bucket).download(name);
	if (error) {
		console.log(chalk.red(`Can not download file: ${bucket}/${name}`));
		// console.error(error);
		return { error };
	}

	const buffer = Buffer.from(await blob.arrayBuffer());

	const path = `${STORAGE_BASE}/${bucket}/${saveName}`.split('/').slice(0, -1).join('/');
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
	fs.writeFileSync(`${STORAGE_BASE}/${bucket}/${saveName}`, buffer);
	console.log(chalk.cyan(`file downloaded: ${bucket}/${name}`));
}

async function downloadUpdated(data: { table: BucketName; id: string }[]) {
	for (const item of data) {
		const { table, id } = item;
		switch (table) {
			case 'wearings':
				for (const textureType of TEXTURE_TYPES) {
					await downloadFile(
						table,
						`textures/${id}_${textureType}`,
						`textures/${id}_${textureType}.jpg`
					);
				}
				break;
			case 'meshes':
				await downloadFile(table, `fbx/${id}`, `${id}.fbx`);
				break;
		}
	}
	console.log(chalk.green('download finished'));
}

export { downloadUpdated, initFileStorage };
