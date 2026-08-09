const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const Media = require('../models/Media');
const { ALLOWED_MIME } = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');

function uploadBufferToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'versa', resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

const listMedia = asyncHandler(async (req, res) => {
  const { kind } = req.query;
  const filter = kind ? { kind } : {};
  const items = await Media.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const kind = ALLOWED_MIME[req.file.mimetype];
  const resourceType = kind === 'document' ? 'raw' : 'image';

  try {
    const result = await uploadBufferToCloudinary(req.file.buffer, resourceType);

    const media = await Media.create({
      fileName: result.public_id,
      originalName: req.file.originalname,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size,
      kind
    });

    res.status(201).json({ item: media });
  } catch (err) {
    console.error('[cloudinary upload]', err.message);
    res.status(500).json({ message: 'Upload to Cloudinary failed. Check your Cloudinary credentials in .env.' });
  }
});

const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) return res.status(404).json({ message: 'Not found' });

  if (media.cloudinaryId) {
    const resourceType = media.kind === 'document' ? 'raw' : 'image';
    await cloudinary.uploader.destroy(media.cloudinaryId, { resource_type: resourceType }).catch(() => {});
  }

  await media.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = { listMedia, uploadMedia, deleteMedia };