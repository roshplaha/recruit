var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var stage = require('../constants/stage');
var jobProfile = require('../models/jobProfile');
var moment = require('moment');

var csrfProtection = csrf();
router.use(csrfProtection);

var Candidate = require('../models/candidate');


router.get('/addCandidate', isLoggedIn, function (req, res, next) {

    var roles = ['Analyst', 'Consultant Analyst', 'Consultant', 'Principle Consultant', 'Management Consultant', 'Director', 'Partner'];
    console.log("ROLES: " + JSON.stringify(roles));

    res.render('recruits/add', {csrfToken: req.csrfToken(), availableRoles: roles});
});

router.post('/addCandidate', isLoggedIn, function (req, res, next) {

    var candidate = new Candidate({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        rank: req.body.rank,
        interviewDate: req.body.interviewdate, //mongoose saves dates in a long full format e.g. Fri Sep 16 2011 19:05:17 GMT+0900 (BST)
        stage: stage.FIRST_STAGE,
        daysInSystem: 0,
        keySkills: req.body.keyskills
    });

    candidate.save(function (err, candidate) {
        if (err) return console.error(err);
    });

    console.log("saved candidate entry to db: " + candidate);
    res.redirect('/');
});

router.post('/updateCandidateStage/:id/:stage', function (req, res, next) {
    var id = req.params.id;
    var newStage = req.params.stage;

    console.log("Got an update request for id " + id + " to go to " + newStage);

    Candidate.findById(id, function (err, candidate) {
        if (err) return handleError(err);

        candidate.stage = newStage;
        candidate.save(function (err, updatedCandidate) {
            if (err) return handleError(err);
        });
    });
    res.redirect('/');
});

router.post('/updateCandidate/:id', function (req, res, next) {
    var id = req.params.id;
    console.log("This is the id " + id);
    Candidate.findById(id, function (err, candidate) {

        candidate.firstName = req.body.firstname;
        candidate.lastName = req.body.lastname;
        candidate.rank = req.body.rank;
        candidate.interviewDate = req.body.interviewdate;
        candidate.keySkills = req.body.keyskills;

        candidate.save(function (err, updatedCandidate) {
            if (err) return handleError(err);
        });
    });

    res.redirect("/pa-recruitment/pipeline");
});

router.get('/updateCandidate/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    console.log("Updating candidate details so need to pull there details to the screen using id: " + id);

    doStuff(id, function (err, candidate) {

        var candidateKeySkills = candidate.keySkills;

        var profile = new jobProfile();
        profile.queryAgainstKeyWords(candidateKeySkills, function (er, resp) {

            var maxScore = resp.hits.max_score;

            if (maxScore == null) { //must be no result
                console.log("hello there");
                res.render('recruits/updateCandidate', {
                    csrfToken: req.csrfToken(),
                    candidateDetails: candidate,
                    bestJobMatch: null
                });
                return;
            }

            var bestResponse = resp.hits.hits.filter(h => h._score === maxScore);

            res.render('recruits/updateCandidate', {
                csrfToken: req.csrfToken(),
                candidateDetails: candidate,
                bestJobMatch: bestResponse[0] // get first for now if (even if more than 1 item returned)
            });
        });

    });

})
;

var doStuff = function (id, fn) {
    Candidate.findById(id, function (err, candidate) {
        if (err) return handleError(err);
        fn(null, candidate);
    });
};


router.get('/pipeline', isLoggedIn, function (req, res, next) {
    Candidate.find(function (err, docs) {

        var chunks = 'chunks';
        chunks = [];

        var first = docs.filter(d => d.stage === stage.FIRST_STAGE);
        var first_stage = {
            name: stage.FIRST_STAGE,
            data: first
        };
        chunks.push(first_stage);

        var second = docs.filter(d => d.stage === stage.SECOND_STAGE);
        var second_stage = {
            name: stage.SECOND_STAGE,
            data: second
        };
        chunks.push(second_stage);

        var rejected = docs.filter(d => d.stage === stage.REJECTED_STAGE);
        var rejected_stage = {
            name: stage.REJECTED_STAGE,
            data: rejected
        };
        chunks.push(rejected_stage);

        var offer = docs.filter(d => d.stage === stage.OFFER_STAGE);
        var offer_stage = {
            name: stage.OFFER_STAGE,
            data: offer
        };
        chunks.push(offer_stage);

        var accepted = docs.filter(d => d.stage === stage.ACCEPTED_STAGE);
        var accepted_stage = {
            name: stage.ACCEPTED_STAGE,
            data: accepted
        };
        chunks.push(accepted_stage);
        console.log("mi" + JSON.stringify(chunks));

        res.render('recruits/pipeline', {csrfToken: req.csrfToken(), title: 'Pipeline', candidateStage: chunks});
    });
});

router.use('/', notLoggedIn, function (req, res, next) {
    console.log("REDIRECT")
    next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
