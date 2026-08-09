const jwt = require('jsonwebtoken');

function generateAccessToken(adminId) {
  return jwt.sign({ sub: adminId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
  });
}

function generateRefreshToken(adminId) {
  return jwt.sign({ sub: adminId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
  });
}

module.exports = { generateAccessToken, generateRefreshToken };
