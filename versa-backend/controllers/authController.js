const { z } = require('zod');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  path: '/'
};

const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email or password format' });
  }
  const { email, password } = parsed.data;

  const invalidMsg = { message: 'Invalid credentials' };

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return res.status(401).json(invalidMsg);

  if (admin.isLocked()) {
    return res.status(423).json({ message: 'Account temporarily locked. Try again later.' });
  }

  const valid = await admin.comparePassword(password);
  if (!valid) {
    admin.failedLoginAttempts += 1;
    if (admin.failedLoginAttempts >= MAX_ATTEMPTS) {
      admin.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
      admin.failedLoginAttempts = 0;
    }
    await admin.save();
    return res.status(401).json(invalidMsg);
  }

  admin.failedLoginAttempts = 0;
  admin.lockUntil = undefined;
  admin.lastLoginAt = new Date();
  await admin.save();

  const accessToken = generateAccessToken(admin._id);
  const refreshToken = generateRefreshToken(admin._id);

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

  res.json({ admin: { id: admin._id, email: admin.email, name: admin.name } });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ message: 'Session expired' });
  }

  const admin = await Admin.findById(decoded.sub);
  if (!admin) return res.status(401).json({ message: 'Not authenticated' });

  const accessToken = generateAccessToken(admin._id);
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.json({ message: 'Refreshed' });
});

function logout(req, res) {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.json({ message: 'Logged out' });
}

const me = asyncHandler(async (req, res) => {
  res.json({ admin: { id: req.admin._id, email: req.admin.email, name: req.admin.name } });
});

module.exports = { login, logout, me, refresh };