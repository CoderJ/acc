var express = require('express');
var router = express.Router();
var amazonCrawler = require(__base + 'modules/amazonCrawler');
var json2csv = require('json2csv');
var fs = require('fs');
var permission = require(__base + 'modules/permission');
router.use('/users', require(__base + 'routes/users'));
router.use('/api', require(__base + 'routes/api'));

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!permission(req, res)) {
        return false;
    }
    res.render('index',{"title" : "Index", "key":"", "user" : req.session.user, "permission":req.session.permission});

});
router.get(/download\/(\w+)\/([^\/]+)/, function(req, res, next) {
    if (!permission(req, res)) {
        return false;
    }
    var id = req.params[0];
    amazonCrawler.getAllComments(id,function(data){
        try {
          var result = json2csv({ data: data, fields: ["title","author","date","avp-badge","body","star","votes","images.0","images.1","images.2","images.3",] });
          //res.set('Content-Type', 'text/csv');
          //res.send(result);
          fs.writeFileSync(__base + '/public/files/'+req.params[1],result);
          res.redirect('/files/'+req.params[1]);
        } catch (err) {
          res.send(err);
        }


    });

});
module.exports = router;