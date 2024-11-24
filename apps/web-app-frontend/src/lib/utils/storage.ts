import type { BucketName } from '@/config';
import { openDB } from 'idb';
import { sysState } from '@/states';
import { downloadFile, getFilePublicUrl } from '@/api/storage';
async function getDB() {
  return openDB('my-database', 1, {
    upgrade(db) {
      db.createObjectStore('files');
      db.createObjectStore('metadata');
    },
  });
}



async function download(bucket: BucketName, filename: string) {
	const url = await downloadFile(bucket, filename);
	console.log('download url', url);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to download ${url}`);
    return;
  }
  const data = await res.blob();
  const db = await getDB();
  await db.put('files', data, `${bucket}/${filename}`);
}

async function getFile(bucket: BucketName, filename: string) {
  const db = await getDB();
  const key = `${bucket}/${filename}`;
  let data = await db.get('files', key);
  if (data) {
    return { data };
  } else {
    console.log(`File not found in IndexedDB: ${key}, downloading...`);
    await download(bucket, filename);
    data = await db.get('files', key);
    if (data) {
      return { data };
    } else {
      return { error: 'File not found after download attempt' };
    }
  }
}

async function getFileUrl(bucket: BucketName, filename: string, mimetype?: string) {
  const { data, error } = await getFile(bucket, filename);
  if (error) {
    // 無法取得檔案，直接返回公開 URL
		const url = `https://xotjfplbckgkrvjwpwih.supabase.co/storage/v1/object/public/${bucket}/${filename}`;// await getFilePublicUrl(bucket, filename);
		console.log('public url', url);
    return { data: url };
  }
  const url = URL.createObjectURL(data);
  return { data: url };
}

async function fileExists(bucket: BucketName, filename: string) {
  const db = await getDB();
  const key = `${bucket}/${filename}`;
  const data = await db.get('files', key);
  return !!data;
}

async function getLocalMetadata() {
  const db = await getDB();
  const data = await db.get('metadata', 'assetMetadata');
  return data as AssetMetadata;
}

async function setLocalMetadata(data: AssetMetadata) {
  const db = await getDB();
  await db.put('metadata', data, 'assetMetadata');
}

class FileDownloader {
  list = new Set<{ bucket: BucketName; filename: string }>();

  add(bucket: BucketName, filename: string) {
    this.list.add({ bucket, filename });
  }

  async init() {
    // IndexedDB 不需要初始化資料夾，這裡可以省略
    // 確保 metadata 存在
    const db = await getDB();
    const metadataExists = await db.get('metadata', 'assetMetadata');
    if (!metadataExists) {
      console.log('Metadata not found, creating new entry');
      await db.put('metadata', {
        regions: [],
        wearings: [],
        owned_wearings: [],
        meshes: [],
      }, 'assetMetadata');
    }
  }

  async start() {
    console.log('Starting download of files:', this.list);
    if (this.list.size > 0) {
      const size = this.list.size;
      await Promise.all(
        [...this.list].map(async (item) => {
          try {
            await download(item.bucket, item.filename);
            sysState.downloadProgress += 1 / size;
            console.log(`Downloaded: ${item.bucket}/${item.filename}`);
          } catch (e) {
            console.error('Error in file downloader:', e);
          } finally {
            this.list.delete(item);
            console.log(`Files remaining: [${this.list.size}/${size}]`);
          }
        })
      );
      console.log('All downloads complete');
    } else {
      sysState.downloadProgress = 1;
      console.log('No files to download');
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
  fileExists,
  FileDownloader,
};
