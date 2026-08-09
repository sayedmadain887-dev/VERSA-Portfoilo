const makeSingletonController = require('./makeSingletonController');
const ContactSettings = require('../models/ContactSettings');

module.exports = makeSingletonController(ContactSettings);
