// NOTE: this file is the ADMIN CRUD API (create/update/delete + full field list).
// Public read-only access for the live site is served separately from routes/public.js
// so the published site never depends on an authenticated session.
const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const makeCrudRouter = require('./makeCrudRouter');
const projectController = require('../controllers/projectController');

router.use(requireAdmin);
router.use('/', makeCrudRouter(projectController));

module.exports = router;
