const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const rateLimit = require('express-rate-limit');
const c = require('../controllers/contactMessageController');

// Protects the public form from spam without requiring login
const submitLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5 });

// PUBLIC - the only unauthenticated write endpoint in the whole API
router.post('/submit', submitLimiter, c.submitMessage);

// ADMIN ONLY
router.get('/', requireAdmin, c.listMessages);
router.put('/:id/status', requireAdmin, c.updateMessageStatus);
router.delete('/:id', requireAdmin, c.deleteMessage);

module.exports = router;
