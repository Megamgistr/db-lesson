const mongoose = require('mongoose');
const beatifuleValidator = require('mongoose-beautiful-unique-validation');


mongoose.set('debug', true);
mongoose.plugin(beatifuleValidator);

module.exports = mongoose.createConnection("mongourl")