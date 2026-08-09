const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const c = require('../controllers/aboutController');

router.use(requireAdmin);

router.get('/', c.getAbout);
router.put('/', c.updateAbout);

router.post('/timeline', c.addTimelineItem);
router.put('/timeline/:itemId', c.updateTimelineItem);
router.delete('/timeline/:itemId', c.deleteTimelineItem);
router.post('/timeline/reorder', c.reorderTimeline);

router.put('/cv', c.updateCv);
router.delete('/cv', c.deleteCv);

module.exports = router;
