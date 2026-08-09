const express = require('express');
const router = express.Router();

const Project = require('../models/Project');
const Service = require('../models/Service');
const Skill = require('../models/Skill');
const Navigation = require('../models/Navigation');
const About = require('../models/About');
const HomeContent = require('../models/HomeContent');
const ContactSettings = require('../models/ContactSettings');
const SiteSettings = require('../models/SiteSettings');
const SeoSettings = require('../models/SeoSettings');

// Every route here only returns items marked visible=true, and never
// exposes internal-only fields (e.g. nothing from Finance/Client models
// is reachable through this router at all).

router.get('/projects', async (req, res) => {
  const projects = await Project.find({ visible: true }).sort({ order: 1 });
  res.json({ projects });
});

router.get('/projects/:slug', async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, visible: true });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json({ project });
});

router.get('/services', async (req, res) => {
  const services = await Service.find({ visible: true }).sort({ order: 1 });
  res.json({ services });
});

router.get('/skills', async (req, res) => {
  const skills = await Skill.find({ visible: true }).sort({ category: 1, order: 1 });
  res.json({ skills });
});

router.get('/navigation', async (req, res) => {
  const items = await Navigation.find({ visible: true }).sort({ order: 1 });
  res.json({ items });
});

router.get('/about', async (req, res) => {
  const about = await About.findOne();
  if (!about) return res.json({ about: null });
  const obj = about.toObject();
  obj.timeline = obj.timeline.filter((t) => t.visible).sort((a, b) => a.order - b.order);
  res.json({ about: obj });
});

router.get('/home', async (req, res) => {
  const home = await HomeContent.findOne();
  res.json({ home });
});

router.get('/contact-settings', async (req, res) => {
  const settings = await ContactSettings.findOne();
  if (!settings) return res.json({ settings: null });
  const obj = settings.toObject();
  obj.whenToReachOut = (obj.whenToReachOut || []).filter((i) => i.visible).sort((a, b) => a.order - b.order);
  obj.howWeWork = (obj.howWeWork || []).filter((i) => i.visible).sort((a, b) => a.order - b.order);
  res.json({ settings: obj });
});

router.get('/site-settings', async (req, res) => {
  const settings = await SiteSettings.findOne();
  res.json({ settings });
});

router.get('/seo/:page', async (req, res) => {
  const seo = await SeoSettings.findOne({ page: req.params.page });
  res.json({ seo });
});

module.exports = router;
