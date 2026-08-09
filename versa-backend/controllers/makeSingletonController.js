/**
 * For "there is only ever one of these" documents (HomeContent, SiteSettings,
 * ContactSettings). GET creates the document on first access if missing, so
 * the dashboard never has to handle a null state.
 */
function makeSingletonController(Model) {
  return {
    async get(req, res) {
      let doc = await Model.findOne();
      if (!doc) doc = await Model.create({});
      res.json({ item: doc });
    },
    async update(req, res) {
      let doc = await Model.findOne();
      if (!doc) doc = new Model({});
      Object.assign(doc, req.body);
      await doc.save();
      res.json({ item: doc });
    }
  };
}

module.exports = makeSingletonController;
