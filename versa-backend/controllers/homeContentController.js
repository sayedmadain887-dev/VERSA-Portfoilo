const makeSingletonController = require('./makeSingletonController');
const HomeContent = require('../models/HomeContent');

module.exports = makeSingletonController(HomeContent);
