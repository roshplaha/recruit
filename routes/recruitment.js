var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var stage = require('../constants/stage');

var csrfProtection = csrf();
router.use(csrfProtection);

var Candidate = require('../models/candidate');


router.get('/addCandidate', isLoggedIn, function (req, res, next) {
    res.render('recruits/add', {csrfToken: req.csrfToken()});
});

router.post('/addCandidate', isLoggedIn, function (req, res, next) {

    var candidate = new Candidate({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        rank: req.body.rank,
        interviewDate: req.body.interviewdate,
        stage: stage.FIRST_STAGE,
        daysInSystem: 0
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

    console.log("Got an update request " + id + " " + newStage);

    Candidate.findById(id, function (err, candidate) {
        if (err) return handleError(err);

        candidate.stage = newStage;
        candidate.save(function (err, updatedCandidate) {
            if (err) return handleError(err);
        });
    });
    res.redirect('/');
});


router.get('/pipeline', isLoggedIn, function (req, res, next) {
    Candidate.find(function (err, docs) {

        //var o = {}; // empty Object

        var chunks = 'chunks';
        chunks = [];

        var first = docs.filter(d=>d.stage===stage.FIRST_STAGE);
        var first_stage = {
            name: stage.FIRST_STAGE,
            data: first
        };
        chunks.push(first_stage);

        var second = docs.filter(d=>d.stage===stage.SECOND_STAGE);
        var second_stage = {
            name: stage.SECOND_STAGE,
            data: second
        };
        chunks.push(second_stage);

        var rejected = docs.filter(d=>d.stage===stage.REJECTED_STAGE);
        var rejected_stage = {
            name: stage.REJECTED_STAGE,
            data: rejected
        };
        chunks.push(rejected_stage);

        var offer = docs.filter(d=>d.stage===stage.OFFER_STAGE);
        var offer_stage = {
            name: stage.OFFER_STAGE,
            data: offer
        };
        chunks.push(offer_stage);

        var accepted = docs.filter(d=>d.stage===stage.ACCEPTED_STAGE);
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
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function exit() {
}
