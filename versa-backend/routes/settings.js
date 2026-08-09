const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');

const homeContentController = require('../controllers/homeContentController');
const siteSettingsController = require('../controllers/siteSettingsController');
const contactSettingsController = require('../controllers/contactSettingsController');
const seoController = require('../controllers/seoController');

router.use(requireAdmin);

router.get('/home', homeContentController.get);
router.put('/home', homeContentController.update);

router.get('/site', siteSettingsController.get);
router.put('/site', siteSettingsController.update);

router.get('/contact', contactSettingsController.get);
router.put('/contact', contactSettingsController.update);

router.get('/seo', seoController.listSeo);
router.put('/seo/:page', seoController.upsertSeo);

module.exports = router;
