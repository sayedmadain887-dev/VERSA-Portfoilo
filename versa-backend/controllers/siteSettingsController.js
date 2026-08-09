const makeSingletonController = require('./makeSingletonController');
const SiteSettings = require('../models/SiteSettings');

module.exports = makeSingletonController(SiteSettings);
