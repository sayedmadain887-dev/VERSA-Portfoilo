const About = require('../models/About');

async function getSingleton() {
  let doc = await About.findOne();
  if (!doc) doc = await About.create({});
  return doc;
}

async function getAbout(req, res) {
  const about = await getSingleton();
  res.json({ about });
}

async function updateAbout(req, res) {
  const about = await getSingleton();
  const { timeline, cv, ...rest } = req.body; // timeline/cv handled by dedicated endpoints
  Object.assign(about, rest);
  await about.save();
  res.json({ about });
}

// ---- Timeline sub-resource ----

async function addTimelineItem(req, res) {
  const about = await getSingleton();
  about.timeline.push(req.body);
  await about.save();
  res.status(201).json({ about });
}

async function updateTimelineItem(req, res) {
  const about = await getSingleton();
  const item = about.timeline.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Timeline item not found' });
  Object.assign(item, req.body);
  await about.save();
  res.json({ about });
}

async function deleteTimelineItem(req, res) {
  const about = await getSingleton();
  about.timeline.pull({ _id: req.params.itemId });
  await about.save();
  res.json({ about });
}

async function reorderTimeline(req, res) {
  const about = await getSingleton();
  const { order } = req.body; // [{ id, order }]
  order.forEach(({ id, order: o }) => {
    const item = about.timeline.id(id);
    if (item) item.order = o;
  });
  await about.save();
  res.json({ about });
}

// ---- CV ----

async function updateCv(req, res) {
  const about = await getSingleton();
  about.cv = { fileUrl: req.body.fileUrl, fileName: req.body.fileName, uploadedAt: new Date() };
  await about.save();
  res.json({ about });
}

async function deleteCv(req, res) {
  const about = await getSingleton();
  about.cv = undefined;
  await about.save();
  res.json({ about });
}

module.exports = {
  getAbout,
  updateAbout,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  reorderTimeline,
  updateCv,
  deleteCv
};
