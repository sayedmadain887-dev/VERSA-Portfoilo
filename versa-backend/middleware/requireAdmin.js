const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protects every admin/API route. Reads the access token from the
 * httpOnly cookie (never from a header the client could forge easily),
 * verifies it, and attaches the admin to the request.
 *
 * Any request without a valid token is rejected with 401 here, in the
 * backend — the frontend redirect to /admin/login is a UX convenience,
 * not the actual security boundary.
 */
async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const admin = await Admin.findById(decoded.sub).select('-passwordHash');
    if (!admin) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }
}

module.exports = requireAdmin;
