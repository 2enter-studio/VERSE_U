import type { BucketName } from '@/config';
import { db } from '@/db';
import { Directory, Filesystem } from '@capacitor/filesystem';
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
			await Filesystem.mkdir({ path: bucket, directory });
		});
		await Filesystem.writeFile({ path, directory, data });
	}
	if (force) {
		await run();
	} else {
		await Filesystem.readFile({ path, directory }).catch(async (e) => {
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
			folders.map((folder) =>
				Filesystem.readdir({ path: folder, directory }).catch(
					async (e) => await Filesystem.mkdir({ directory, path: folder })
				)
			)
		);
	}
	async start() {
		await this.init();
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
		}
	}
}

const fileDownloader = new FileDownloader();

export { download, getFilePublicUrl, getFile, getFileUrl, fileDownloader };
