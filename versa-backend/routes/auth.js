const express = require('express');
const router = express.Router();
const { login, logout, me, refresh } = require('../controllers/authController');
const requireAdmin = require('../middleware/requireAdmin');
const { loginLimiter } = require('../middleware/rateLimiters');

router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', requireAdmin, logout);
router.get('/me', requireAdmin, me);

module.exports = router;