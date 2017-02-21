global.__base = __dirname + '/'
var extend = require(__base + 'modules/extend');
var superagent = require('superagent');
var mongodb = require(__base + 'modules/db');
var cheerio = require('cheerio');
var amazonCrawler = require(__base + 'modules/amazonCrawler');
var crawler = function() {
    mongodb(function(db) {
        var getSchedule = function() {
            amazonCrawler.getOne(function(data) {
                if (data.length > 0) {
                    amazonCrawler.getOnePage(data[0], function() {
                        console.log(data[0]);
                        getSchedule();
                    });
                } else {
                    setTimeout(getSchedule, 3000);
                }
            });
        }
        getSchedule();
    });
}
module.exports = crawler;