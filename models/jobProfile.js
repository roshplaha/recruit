var client = require('./connection.js');

module.exports = function JobProfile() {

    this.queryAgainstKeyWords = function(words, callback) {

        client.search({
            index: 'skills',
            type: 'job-profile',
            body: {
                query: {
                    match: {
                        "JobBody": words
                    }
                }
            }
        }).then(function(resp) {
            console.log("Response of elastic search: " + JSON.stringify(resp));
            callback(null, resp);

        }, function (err) {
            console.trace(err.message);
        });

    };
};