// Run this ONCE to create your admin account:  node seedAdmin.js
// There is no public sign-up form anywhere in this project - this script
// is the only way an Admin document ever gets created.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('An admin with this email already exists. Nothing to do.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash, name: 'Admin' });

  console.log(`Admin account created for ${email}. You can now log in from /admin/login.`);
  process.exit(0);
}

seed();
