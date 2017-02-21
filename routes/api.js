var express = require('express');
var router = express.Router();
var amazonCrawler = require(__base + 'modules/amazonCrawler');
var permission = require(__base + 'modules/permission');
var permissionOpt = {
    isApi: true
};
router.post('/test', function(req, res) {
    if (!permission(req, res,'', permissionOpt)) {
        return false;
    }
    var url = req.body.url;
    amazonCrawler.test(url,function(d){
        res.send(d);
    });
});
router.post('/create', function(req, res) {
    if (!permission(req, res,'', permissionOpt)) {
        return false;
    }
    var params = req.body;
    amazonCrawler.create(params,function(d){
        res.send(d);
    });
});
router.get('/', function(req, res) {
    if (!permission(req, res,'', permissionOpt)) {
        return false;
    }
    amazonCrawler.list(function(d){
        res.send(d);
    });
});
module.exports = router;