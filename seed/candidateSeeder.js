var Candidate = require('../models/candidate');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/recruitment');

var candidates = [
    new Candidate({
        firstName: 'Bam',
        lastName: 'Jammer',
        rank: 'CONSULTANT',
        interviewDate: '10/10/2018',
        stage: 'OFFER',
        daysInSystem: 0,
        keySkills: "node amazon big-data"
    })
];

var done = 0;
for (var i = 0; i < candidates.length; i++) {
    candidates[i].save(function (err, result) {
        done++;
        if (done === candidates.length) {
            exit();
        }
    })
}

function exit() {
    mongoose.disconnect();
}