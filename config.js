if (__dirname.indexOf("\\") > -1) {
    var _dir = __dirname.split("\\").reverse()[0];
} else {
    var _dir = __dirname.split("/").reverse()[0];
}
var express = require('express');
var app = express();
var config = {
    cookieSecret: 'coderj!2017',
    sessionSecret: 'coderj!2017',
    cookieMaxAge: 1000 * 60 * 60,
    serverPort: 8080,
    db: {
        db: "acc",
        host: "localhost",
        port: 27017
    },
    prerenderUrl : "http://127.0.0.1:8050/",
    auth: true,
};
module.exports = config;