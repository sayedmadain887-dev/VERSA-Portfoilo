const makeCrudController = require('./makeCrudController');
const Navigation = require('../models/Navigation');

module.exports = makeCrudController(Navigation, { searchFields: ['label'] });
