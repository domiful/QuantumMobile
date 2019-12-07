const Kinvey = require('kinvey-nativescript-sdk');
const kinveyAppKey = "kid_rkSgueyLB";
const kinveyAppSecret = "7d88554d2ad242a08e0e079056a39139";
const kinveyUsername = "admin";
const kinveyPassword = "admin";

exports.setup = function () {
    Kinvey.init({
        appKey: kinveyAppKey,
        appSecret: kinveyAppSecret
    });
};
