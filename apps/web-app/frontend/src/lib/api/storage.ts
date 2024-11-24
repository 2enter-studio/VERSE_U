import { baseUrl } from './utils';

export async function getFilePublicUrl(bucket: BucketName, filename: string) {
  return `${baseUrl}/api/storage/public/${bucket}/${filename}`;
}

export async function downloadFile(bucket: BucketName, filename: string) {
  return `${baseUrl}/api/storage/${bucket}/${filename}`;
}
