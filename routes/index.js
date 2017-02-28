var express = require('express');
var router = express.Router();
var amazonCrawler = require(__base + 'modules/amazonCrawler');
var fs = require('fs');
var nodeExcel = require('excel-export');
var permission = require(__base + 'modules/permission');
router.use('/users', require(__base + 'routes/users'));
router.use('/api', require(__base + 'routes/api'));
/* GET home page. */
router.get('/', function(req, res, next) {
    if (!permission(req, res)) {
        return false;
    }
    res.render('index', {
        "title": "Index",
        "key": "",
        "user": req.session.user,
        "permission": req.session.permission
    });
});
router.get(/download\/keywords\/(\w+)\/([^\/]+)/, function(req, res, next) {
    if (!permission(req, res)) {
        return false;
    }
    var id = req.params[0];
    console.error("id","======================");
    console.log(id);
    amazonCrawler.getKeywords(id, function(data) {
        var fields = ["keyword", "freq"];
        var conf = {};
        conf.name = "mysheet";
        conf.cols = [{
                caption: "keyword",
                type: 'string',
            },{
                caption: "times",
                type: 'number',
            }];
        conf.rows = [];
        for (i in data) {
            var item = [data[i].name,data[i].value];
            conf.rows.push(item);
        }
        console.log(conf);
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + req.params[1]);
        res.end(result, 'binary');
    });
});
router.get(/download\/(\w+)\/([^\/]+)/, function(req, res, next) {
    if (!permission(req, res)) {
        return false;
    }
    var id = req.params[0];
    amazonCrawler.getAllComments(id, function(data) {
        var fields = ["title", "author", "date", "avp-badge", "body", "star", "votes", "images"];
        var conf = {};
        conf.name = "mysheet";
        conf.cols = [];
        for (i in fields) {
            conf.cols.push({
                caption: fields[i],
                type: 'string',
            });
        }
        for (var x = 0; x < 9; x++) {
            conf.cols.push({
                caption: "",
                type: 'string',
            });
        }
        conf.rows = [];
        for (i in data) {
            var item = [];
            for (j in fields) {
                if (fields[j] == "images") {
                    for (var x = 0; x < 10; x++) {
                        item.push(data[i]["images"][x] || "");
                    }
                } else {
                    item.push(data[i][fields[j]] || "");
                }
            }
            conf.rows.push(item);
        }
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + req.params[1]);
        res.end(result, 'binary');
    });
});

module.exports = router;