import * as StorageModel from '../models/storageModel.ts';

export const downloadFile = async (bucket: BucketName, filename: string) => {
  return await StorageModel.downloadFile(bucket, filename);
};

export const getFilePublicUrl = async (bucket: BucketName, filename: string) => {
  return await StorageModel.getFilePublicUrl(bucket, filename);
};
