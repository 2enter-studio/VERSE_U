import fs from 'fs-extra';
import { type BucketName, STORAGE_BASE, TEXTURE_TYPES } from '@/config';
import { db } from './db';
import chalk from 'chalk';

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

	const blobType = blob.type;
	const extension = blobType.split('/')[0] === 'image' ? `.${blobType.split('/')[1]}` : '';

	if (!saveName.includes('.') && extension === '') {
		console.log(chalk.red('About to save a file without extension...'));
	}

	// console.log(chalk.yellow(`file type: ${blobType}`));
	const buffer = Buffer.from(await blob.arrayBuffer());
	const path = `${STORAGE_BASE}/${bucket}/${saveName}`.split('/').slice(0, -1).join('/');
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
	await fs.writeFile(`${STORAGE_BASE}/${bucket}/${saveName}${extension}`, buffer);
	console.log(
		chalk.cyan(`file downloaded: ${bucket}/${name} -> ${bucket}/${saveName}${extension}`)
	);
}

async function downloadUpdated(data: { table: BucketName; id: string }[]) {
	const promises: Promise<any>[] = [];
	for (const item of data) {
		const { table, id } = item;
		switch (table) {
			case 'wearings':
				for (const textureType of TEXTURE_TYPES) {
					promises.push(downloadFile(table, `textures/${id}_${textureType}`));
				}
				break;
			case 'meshes':
				promises.push(downloadFile(table, `fbx/${id}`, `${id}.fbx`));
				break;
		}
	}
	await Promise.all(promises);
	console.log(chalk.green('download finished'));
}

export { downloadUpdated, initFileStorage };
