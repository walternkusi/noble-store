import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64DataUrl: string, folder: string = 'noble-store'): Promise<string> {
  const result = await cloudinary.uploader.upload(base64DataUrl, {
    folder,
    resource_type: 'image',
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto:good' },
    ],
  });
  return result.secure_url;
}

export async function uploadImages(base64DataUrls: string[], folder: string = 'noble-store'): Promise<string[]> {
  const uploads = base64DataUrls.map((url) => uploadImage(url, folder));
  return Promise.all(uploads);
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
