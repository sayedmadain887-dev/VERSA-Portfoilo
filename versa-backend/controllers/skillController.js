const makeCrudController = require('./makeCrudController');
const Skill = require('../models/Skill');

module.exports = makeCrudController(Skill, { searchFields: ['name', 'category'] });
