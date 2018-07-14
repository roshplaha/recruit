var elasticsearch = require('elasticsearch');


var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

// client.ping({
//     requestTimeout: 1000
// }, function(error) {
//    if (error) {
//        console.trace('elasticsearch cluster is down!');
//    } else {
//        console.log("All is well");
//    }
// });
//
// //create an index
// var indexNotExist = false;
// if(indexNotExist)
// client.indices.create({
//     index: 'skills'
// }, function(err, resp, status) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("create", resp);
//     }
// });
//
//
// client.index({
//     index: 'skills',
//     id: '1', // if not provided - this will be auto-generated. if you do provided and run again - doc will beu updated
//     type: 'job-profile',
//     body: {
//         "JobName": "Home Office",
//         "JobType": "Developer",
//         "JobBody": "Java microservices sqs amazon big data"
//     }
// }, function(err, resp, status) {
//     console.log(resp);
// });

// client.index({
//     index: 'skills',
//     id: '2', // if not provided - this will be auto-generated. if you do provided and run again - doc will beu updated
//     type: 'job-profile',
//     body: {
//         "JobName": "Photobox",
//         "JobType": "Developer",
//         "JobBody": "Javascript react development amazon"
//     }
// }, function(err, resp, status) {
//     console.log(resp);
// });


client.search({
    index: 'skills',
    type: 'job-profile',
    body: {
        query: {
            match: {
                "JobBody": "amazon javascript"
            }
        }
    }
}).then(function(resp) {
    console.log(JSON.stringify(resp));
}, function (err) {
    console.trace(err.message);
});