const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToExternalStorage(file) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result.secure_url,
          format: result.format,
          resourceType: result.resource_type,
          publicId: result.public_id
        });
      }
    );

    uploadStream.end(file.buffer);
  });
}

module.exports = { uploadToExternalStorage };
