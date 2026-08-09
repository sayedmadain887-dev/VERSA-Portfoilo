const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const makeCrudRouter = require('./makeCrudRouter');
const skillController = require('../controllers/skillController');

router.use(requireAdmin);
router.use('/', makeCrudRouter(skillController));

module.exports = router;
