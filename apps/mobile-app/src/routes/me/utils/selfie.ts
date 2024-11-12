import { authState } from '@/states';
import { db } from '@/db';
import { createError } from '@/utils';

function createBlobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Blob creation failed'));
      }
    }, 'image/webp', 0.8);
  });
}

async function uploadSelfie(args: { canvas: HTMLCanvasElement }) {
	console.log('uploadSelfie', args);
	const { canvas } = args;

  const user_id = authState.user?.id;
  if (!user_id) return createError('USER_NOT_FOUND');

  try {
    const blob = await createBlobFromCanvas(canvas);

    const contentType = blob.type || 'image/webp';

    const { error } = await db.storage.from('user_data').upload(`${user_id}/selfie`, blob, {
      upsert: true,
      contentType: contentType,
      cacheControl: '0'
    });
    if (error) {
      console.error(error);
      return { error };
    } else {
      console.log('Upload successful');
    }
  } catch (err) {
    console.error(err);
    return createError('BLOB_CREATION_FAILED');
  }
}

export { uploadSelfie };
