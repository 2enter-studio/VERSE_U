import { apiUrl } from './apiUrl';

async function getFilePublicUrl(bucket: BucketName, filename: string) {
  return apiUrl('storage', 'public', bucket, filename);
}

async function downloadFile(bucket: BucketName, filename: string) {
  return apiUrl('storage', bucket, filename);
}

export { getFilePublicUrl, downloadFile };
