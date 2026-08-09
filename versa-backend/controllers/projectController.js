const makeCrudController = require('./makeCrudController');
const Project = require('../models/Project');

module.exports = makeCrudController(Project, { searchFields: ['title', 'category'] });
