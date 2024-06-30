import type { BucketName } from '@/config';
import { db } from '@/db';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { encode } from 'base64-arraybuffer';

const directory = Directory.Documents;

async function download(bucket: BucketName, filename: string, force: boolean = false) {
  const path = `${bucket}/${filename}`;
  async function run() {
    const res = await fetch(getFilePublicUrl(bucket, filename));
    if (!res.ok) return;
    const buffer = await res.arrayBuffer();
    const data = encode(buffer);
    await Filesystem.writeFile({ path, directory, data, recursive: true });
    console.log(`file downloaded: ${path}`);
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
  if (error) return { error };
  const result =
    typeof data === 'string'
      ? `data:${mimetype ?? 'text/plain'};base64,${data}`
      : URL.createObjectURL(data);

  return { data: result };
}

export { download, getFilePublicUrl, getFile, getFileUrl };
