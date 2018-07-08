var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
    new Product({
        imagePath: 'https://www.gamestop.com/common/images/lbox/141784b.jpg',
        title: 'Mario Kart Delux 8',
        description: 'Game',
        price: 40
    }),
    new Product({
        imagePath: 'https://www.gamestop.com/common/images/lbox/141784b.jpg',
        title: 'Mario Kart Delux 8',
        description: 'Game',
        price: 40
    }),
    new Product({
        imagePath: 'https://www.gamestop.com/common/images/lbox/141784b.jpg',
        title: 'Mario Kart Delux 8',
        description: 'Game',
        price: 40
    }),
    new Product({
        imagePath: 'https://www.gamestop.com/common/images/lbox/141784b.jpg',
        title: 'Mario Kart Delux 8',
        description: 'Game',
        price: 40
    }),
    new Product({
        imagePath: 'https://www.gamestop.com/common/images/lbox/141784b.jpg',
        title: 'Mario Kart Delux 8',
        description: 'Game',
        price: 40
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    })
}

function exit() {
    mongoose.disconnect();
}