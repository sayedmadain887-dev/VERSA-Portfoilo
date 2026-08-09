const multer = require('multer');

const ALLOWED_MIME = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'application/pdf': 'document'
};

const MAX_SIZE = 15 * 1024 * 1024; // 15MB

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME[file.mimetype]) {
    return cb(new Error('File type not allowed'));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = { upload, ALLOWED_MIME };