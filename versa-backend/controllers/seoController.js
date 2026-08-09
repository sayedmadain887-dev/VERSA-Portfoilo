const SeoSettings = require('../models/SeoSettings');

async function listSeo(req, res) {
  const items = await SeoSettings.find();
  res.json({ items });
}

async function upsertSeo(req, res) {
  const { page } = req.params;
  const item = await SeoSettings.findOneAndUpdate(
    { page },
    { ...req.body, page },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ item });
}

module.exports = { listSeo, upsertSeo };
