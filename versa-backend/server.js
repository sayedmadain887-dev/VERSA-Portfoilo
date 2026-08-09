require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiters');

const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const skillRoutes = require('./routes/skills');
const navigationRoutes = require('./routes/navigation');
const aboutRoutes = require('./routes/about');
const contactMessageRoutes = require('./routes/contactMessages');
const settingsRoutes = require('./routes/settings');
const mediaRoutes = require('./routes/media');
const publicRoutes = require('./routes/public');

const app = express();

process.on('unhandledRejection', (err) => {
  console.error('[unhandled rejection]', err);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaught exception]', err);
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use('/api', apiLimiter);

app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/public', publicRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/services', serviceRoutes);
app.use('/api/admin/skills', skillRoutes);
app.use('/api/admin/navigation', navigationRoutes);
app.use('/api/admin/about', aboutRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/media', mediaRoutes);

app.use('/api/contact-messages', contactMessageRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Something went wrong' : err.message
  });
});

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[server] Running on port ${PORT}`));