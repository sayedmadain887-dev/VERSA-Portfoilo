const { z } = require('zod');
const ContactMessage = require('../models/ContactMessage');

const submitSchema = z.object({
  fullName: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().min(1)
});

// PUBLIC - anyone can submit the contact form, this is the one intentional
// exception to "admin only". No authentication required, but it's rate
// limited at the router level and strictly validated here.
async function submitMessage(req, res) {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Please check the form fields and try again.' });
  }
  await ContactMessage.create(parsed.data);
  res.status(201).json({ message: 'Message sent' });
}

// ADMIN ONLY from here down

async function listMessages(req, res) {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [messages, total, unreadCount] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ status: 'new' })
  ]);
  res.json({ messages, total, unreadCount, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

async function updateMessageStatus(req, res) {
  const { status } = req.body;
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!message) return res.status(404).json({ message: 'Not found' });
  res.json({ message });
}

async function deleteMessage(req, res) {
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}

module.exports = { submitMessage, listMessages, updateMessageStatus, deleteMessage };
