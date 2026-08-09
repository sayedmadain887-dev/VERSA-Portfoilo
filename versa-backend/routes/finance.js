const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const c = require('../controllers/financeController');

// Every route below is admin-only. There is no public finance endpoint at all.
router.use(requireAdmin);

router.get('/stats', c.getStats);

router.get('/categories', c.listCategories);
router.post('/categories', c.createCategory);
router.put('/categories/:id', c.updateCategory);
router.delete('/categories/:id', c.deleteCategory);

router.get('/transactions', c.listTransactions);
router.post('/transactions', c.createTransaction);
router.put('/transactions/:id', c.updateTransaction);
router.delete('/transactions/:id', c.deleteTransaction);

router.get('/clients', c.listClients);
router.post('/clients', c.createClient);
router.put('/clients/:id', c.updateClient);
router.delete('/clients/:id', c.deleteClient);

module.exports = router;
