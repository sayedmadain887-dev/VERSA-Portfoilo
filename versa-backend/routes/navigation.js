const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const makeCrudRouter = require('./makeCrudRouter');
const navigationController = require('../controllers/navigationController');

router.use(requireAdmin);
router.use('/', makeCrudRouter(navigationController));

module.exports = router;
