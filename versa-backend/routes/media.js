const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const { upload } = require('../middleware/upload');
const c = require('../controllers/mediaController');

router.use(requireAdmin);

router.get('/', c.listMedia);
router.post('/', upload.single('file'), c.uploadMedia);
router.delete('/:id', c.deleteMedia);

module.exports = router;
