var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema  = new Schema({
   firstName: {type: String, required: true},
   lastName: {type: String, required: true},
   stage: {type: String, required: true},
   rank: {type: String, required: true},
   interviewDate: {type: Date, required: true},
   daysInSystem: {type: Number, required: true}
});

module.exports = mongoose.model('Candidate', schema);