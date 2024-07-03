import type { BucketName } from '@/config';
import { db } from '@/db';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { encode } from 'base64-arraybuffer';
import { sysState } from '@/states';

const directory = Directory.Documents;

async function download(bucket: BucketName, filename: string, force: boolean = false) {
	const path = `${bucket}/${filename}`;
	async function run() {
		const res = await fetch(getFilePublicUrl(bucket, filename));
		if (!res.ok) return;
		const buffer = await res.arrayBuffer();
		const data = encode(buffer);
		await Filesystem.readdir({ path: bucket, directory }).catch(async (e) => {
			console.error(e);
			await Filesystem.writeFile({ path, directory, data, recursive: true });
			return;
		});
		await Filesystem.writeFile({ path, directory, data });
	}
	if (force) {
		await run();
	} else {
		await Filesystem.readFile({ path, directory }).catch(async (_) => {
			await run();
		});
	}
}

async function getFile(bucket: BucketName, filename: string) {
	const path = `${bucket}/${filename}`;
	try {
		const { data } = await Filesystem.readFile({ path, directory });
		return { data };
	} catch (e) {
		console.error(e);
		const { data, error } = await db.storage.from(bucket).download(filename);
		if (error) return { error };
		return { data };
	}
}

function getFilePublicUrl(bucket: BucketName, filename: string) {
	const {
		data: { publicUrl }
	} = db.storage.from(bucket).getPublicUrl(filename);
	return publicUrl;
}

async function getFileUrl(bucket: BucketName, filename: string, mimetype?: string) {
	const { data, error } = await getFile(bucket, filename);
	if (error) {
		// await download(bucket, filename)
		return { data: getFilePublicUrl(bucket, filename) };
	}
	const result =
		typeof data === 'string'
			? `data:${mimetype ?? 'text/plain'};base64,${data}`
			: URL.createObjectURL(data);

	return { data: result };
}

async function getLocalMetadata() {
	const { data } = await Filesystem.readFile({
		path: 'metadata.json',
		directory,
		encoding: Encoding.UTF8
	});

	return JSON.parse(data as string) as AssetMetadata;
}

async function setLocalMetadata(data: AssetMetadata) {
	await Filesystem.writeFile({
		directory,
		path: 'metadata.json',
		data: JSON.stringify(data),
		encoding: Encoding.UTF8
	});
}

class FileDownloader {
	list = new Set<{ bucket: BucketName; filename: string }>();

	add(bucket: BucketName, filename: string) {
		this.list.add({ bucket, filename });
	}

	async init() {
		const folders = [
			'wearings',
			'wearings/textures',
			'wearings/thumbnails',
			'regions',
			'regions/stickers',
			'regions/backgrounds',
			'meshes',
			'meshes/glb'
		];
		await Promise.all(
			folders.map((path) =>
				Filesystem.readdir({ path, directory }).catch(
					async (_) => await Filesystem.mkdir({ directory, path })
				)
			)
		);
		await Filesystem.readFile({ path: 'metadata.json', directory, encoding: Encoding.UTF8 }).catch(
			async (_) => {
				console.log('error while finding metadata.json, creating new file');
				await Filesystem.writeFile({
					path: 'metadata.json',
					directory,
					data: JSON.stringify({
						regions: [],
						wearings: [],
						owned_wearings: [],
						meshes: []
					}),
					encoding: Encoding.UTF8
				});
			}
		);
	}

	async start() {
		if (this.list.size > 0) {
			const size = this.list.size;
			await Promise.all(
				[...this.list].map(
					async (item) =>
						new Promise<void>(async (resolve) => {
							await download(item.bucket, item.filename).catch((e) => {
								console.error('error caught in file downloader', e);
								resolve();
							});
							sysState.downloadProgress += 1 / size;
							console.log(`file remain: [${this.list.size}/${size}]`);
							this.list.delete(item);
							resolve();
						})
				)
			);
			console.log('download complete');
		} else {
			sysState.downloadProgress = 1;
			console.log('no download needed');
		}
	}
}

export {
	download,
	getFilePublicUrl,
	getFile,
	getFileUrl,
	getLocalMetadata,
	setLocalMetadata,
	FileDownloader
};
