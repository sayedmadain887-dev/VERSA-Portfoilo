const makeCrudController = require('./makeCrudController');
const Service = require('../models/Service');

module.exports = makeCrudController(Service, { searchFields: ['title'] });
