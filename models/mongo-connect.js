var mongoose = require('mongoose');
var propertiesReader = require('properties-reader');

var properties = propertiesReader('./resources/connection.ini');

module.exports = function Mongoose() {

var host = properties.get('conn.mongodb.host');
var port = properties.get('conn.mongodb.port');
var login = properties.get('conn.mongodb.login');
var db = properties.get('conn.mongodb.db');

var userPassword = login === 0 ? "" : login;
var connectionString = 'mongodb://' + userPassword + host + ':' + port + '/' + db;


    this.start = function() {
        mongoose.connect(connectionString);
    }
};