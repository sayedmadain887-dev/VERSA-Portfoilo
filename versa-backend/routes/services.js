const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const makeCrudRouter = require('./makeCrudRouter');
const serviceController = require('../controllers/serviceController');

router.use(requireAdmin);
router.use('/', makeCrudRouter(serviceController));

module.exports = router;
