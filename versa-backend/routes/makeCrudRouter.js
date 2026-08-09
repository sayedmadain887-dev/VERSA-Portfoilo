const express = require('express');

function makeCrudRouter(controller) {
  const router = express.Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  router.post('/reorder', controller.reorder);
  return router;
}

module.exports = makeCrudRouter;
