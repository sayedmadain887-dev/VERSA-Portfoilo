const asyncHandler = require('../utils/asyncHandler');

function makeCrudController(Model, { searchFields = [] } = {}) {
  return {
    list: asyncHandler(async (req, res) => {
      const { q, visible } = req.query;
      const filter = {};
      if (visible !== undefined) filter.visible = visible === 'true';
      if (q && searchFields.length) {
        filter.$or = searchFields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }));
      }
      const items = await Model.find(filter).sort({ order: 1, createdAt: -1 });
      res.json({ items });
    }),

    getOne: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json({ item });
    }),

    create: asyncHandler(async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json({ item });
      } catch (err) {
        if (err.code === 11000) {
          const field = Object.keys(err.keyPattern || {})[0] || 'field';
          return res.status(409).json({ message: `An item with this ${field} already exists.` });
        }
        if (err.name === 'ValidationError') {
          return res.status(400).json({ message: err.message });
        }
        throw err;
      }
    }),

    update: asyncHandler(async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json({ item });
      } catch (err) {
        if (err.code === 11000) {
          const field = Object.keys(err.keyPattern || {})[0] || 'field';
          return res.status(409).json({ message: `An item with this ${field} already exists.` });
        }
        if (err.name === 'ValidationError') {
          return res.status(400).json({ message: err.message });
        }
        throw err;
      }
    }),

    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    }),

    reorder: asyncHandler(async (req, res) => {
      const { order } = req.body;
      if (!Array.isArray(order)) return res.status(400).json({ message: 'Invalid payload' });
      await Promise.all(order.map((o) => Model.findByIdAndUpdate(o.id, { order: o.order })));
      res.json({ message: 'Reordered' });
    })
  };
}

module.exports = makeCrudController;