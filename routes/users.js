var express = require('express');
var router = express.Router();
var user = require(__base+'modules/users');
var permission = require(__base+'modules/permission');

/* GET users listing. */
router.get('/login', function(req, res, next) {
    if(req.session.user){
        return res.redirect(decodeURIComponent(req.query.callback_url||'/'));
    }
    var d = {}; 

    res.render('login',{"title" : "Login",callback_url:req.query.callback_url||'/'});
});
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    user.login(username,password,function(d){
        req.session.user = d.username;
        req.session.permission = d.permission;
        if(req.session.userid){
            user.update({did:req.session.userid},d.username);
        }
        return res.redirect(decodeURIComponent(req.query.callback_url||'/'));

    },function(d){
        res.render('login',{"title": "Login",err_code:-1,err_msg:'Username or password is invalid.',username: username,callback_url:req.query.callback_url||'/'});
    });
});
router.get('/logout', function(req, res, next) {
        req.session.user = '';
        res.redirect('/');
});

router.get('/', function(req, res, next) {
    if(!permission(req,res,'permission')){
        return false;
    }
    res.render('users',{"title" : "Permission Management", "key":"permission", "user" : req.session.user, "permission":req.session.permission});
});
module.exports = router;
