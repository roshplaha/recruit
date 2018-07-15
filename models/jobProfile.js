var client = require('./connection.js');

module.exports = function JobProfile() {

    this.queryAgainstKeyWords = function(words, callback) {

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
            console.log("Response of elastic search: " + JSON.stringify(resp));
            callback(null, resp);

        }, function (err) {
            console.trace(err.message);
        });

    };

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

};