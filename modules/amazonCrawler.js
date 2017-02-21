var superagent = require('superagent');
var mongodb = require(__base + 'modules/db');
var cheerio = require('cheerio');
var config = require(__base + 'config');
var ObjectId = require('mongodb').ObjectID;
var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf(),
    nounInflector = new natural.NounInflector();
var countInflector = natural.CountInflector;
var verbInflector = new natural.PresentVerbInflector();
var fs = require("fs");
var stopWords = fs.readFileSync(__base + '/data/stop_words', 'utf-8');
stopWords = stopWords.split("\n");
var amazonCrawler = {};
amazonCrawler.getComments = function($) {
    var items = [];
    $("#cm_cr-review_list .a-section.review").each(function() {
        var item = {
            id: $(this).attr("id"),
            star: $(this).find(".review-rating .a-icon-alt").text().replace(" out of 5 stars", ""),
            title: $(this).find(".review-title").text(),
            author: $(this).find(".author").text(),
            date: $(this).find(".review-date").text().replace(/^on /, ""),
            'avp-badge': $(this).find('[data-hook="avp-badge"]').text(),
            "body": $(this).find('[data-hook="review-body"]').text(),
            "votes": $(this).find(".review-votes").text().replace(/^[\n|\s]+/, "").replace(/[\n|\s]+$/, ""),
            "images": []
        };
        $(this).find(".review-image-tile-section .review-image-tile").each(function() {
            item.images.push($(this).attr("src"));
        });
        items.push(item);
    });
    return items;
};
amazonCrawler.test = function(url, callback) {
    var firstUrl = config.prerenderUrl + url + '&pageNumber=1';
    superagent.get(firstUrl).end(function(err, res) {
        var $ = cheerio.load(res.text);
        var items = amazonCrawler.getComments($);
        console.log(items.length);
        var totalCount = parseInt($("#cm_cr-review_list > div.a-section.a-spacing-medium > span:nth-child(1)").text().replace(/.*of /, '').replace(/ reviews.*/, '').replace(/\,/g, ''));
        callback && callback({
            items: items,
            url: url,
            totalCount: totalCount
        });
    });
};
amazonCrawler.getOnePage = function(params, callback) {
    console.log("getOnePage=====", params.name, params.totalPage, params.nowPage);
    var url = config.prerenderUrl + params.url + '&pageNumber=' + params.nowPage;
    superagent.get(url).timeout(10 * 1000).end(function(err, res) {
        if (err || !res) {
            console.log("timeout=====", params.name, params.totalPage, params.nowPage);
            setTimeout(function() {
                amazonCrawler.getOnePage(params, callback);
            });
        } else {
            var $ = cheerio.load(res.text);
            var items = amazonCrawler.getComments($);
            for (i in items) {
                items[i].schedule_id = params._id;
            }
            console.log("gotOnePage=====", params.name, params.totalPage, params.nowPage);
            mongodb(function(db) {
                if (items && items.length > 0) {
                    db.collection("comments").insertMany(items, function() {
                        db.collection("schedule").update({
                            _id: new ObjectId(params._id)
                        }, {
                            $set: {
                                nowPage: params.nowPage + 1
                            }
                        }, function() {
                            callback && callback();
                        });
                    });
                } else {
                    if (params.nowPage + 1 > params.totalPage) {
                        db.collection("schedule").update({
                            _id: new ObjectId(params._id)
                        }, {
                            $set: {
                                crawled: true
                            }
                        }, function() {
                            callback && callback();
                            amazonCrawler.analyze(params);
                        });
                    }
                }
            });
        }
    });
};
amazonCrawler.create = function(params, callback) {
    mongodb(function(db) {
        params.create_at = new Date();
        params.name = params.url.split('/')[3].replace(/-/g, ' ');
        params.crawled = false;
        params.paused = false;
        params.nowPage = 1;
        params.totalPage = Math.ceil(params.totalCount / 10);
        db.collection("schedule").insert(params, function(err, data) {
            callback && callback(data);
        });
    });
};
amazonCrawler.list = function(callback) {
    mongodb(function(db) {
        db.collection("schedule").find().sort({
            _id: -1
        }).limit(20).toArray(function(err, data) {
            callback && callback({
                data: data
            });
        });
    });
};
amazonCrawler.getOne = function(callback) {
    mongodb(function(db) {
        db.collection("schedule").find({
            crawled: false,
            paused: false
        }).sort({
            _id: 1
        }).limit(1).toArray(function(err, data) {
            callback && callback(data);
        });
    });
};
amazonCrawler.getOneCrawled = function(callback) {
    mongodb(function(db) {
        db.collection("schedule").find({
            crawled: true,
        }).sort({
            _id: 1
        }).limit(1).toArray(function(err, data) {
            callback && callback(data);
        });
    });
}
amazonCrawler.getAllComments = function(id, callback) {
    mongodb(function(db) {
        db.collection("comments").find({
            schedule_id: new ObjectId(id),
        }).toArray(function(err, data) {
            callback && callback(data || []);
        });
    });
}
amazonCrawler.analyze = function(params, callback) {
    amazonCrawler.getAllComments(params._id, function(data) {
        var str = "";
        for (i in data) {
            str += data[i].body + "\n";
        }
        tfidf.addDocument(str);
        var res = tfidf.documents[0];
        var resArr = [];
        for (i in res) {
            if (stopWords.indexOf(i) > -1) {
                delete res[i];
                continue;
            }
        }
        var newRes = {};
        for (i in res) {
            var newI = nounInflector.singularize(i);
            if (!newRes[newI]) {
                newRes[newI] = 0;
            }
            newRes[newI] += res[i];
        }
        for (i in newRes) {
            resArr.push({
                name: i,
                value: newRes[i]
            });
        }
        resArr.sort(function(a, b) {
            return b.value - a.value;
        });
        var finalRes = resArr.slice(0, 100);
        mongodb(function(db) {
            db.collection("schedule").update({
                _id: params._id
            }, {
                $set: {
                    analyze: finalRes
                }
            }, function(err, data) {
                callback && callback(finalRes);
            });
        });
        return callback && callback(finalRes);
    });
}
module.exports = amazonCrawler;