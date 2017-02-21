var extend = require(__base + 'modules/extend');
var config = require(__base + 'config');
module.exports = function(req, res, key, opt) {
    var session = req.session;
    if (!session.permission) {
        session.permission = {};
    }
    var defOpt = {
        isApi: false
    };
    opt = extend(true, {}, defOpt, opt || {});
    if (!config.auth) {
        return true;
    } else if (!session.user) {
        if (opt.isApi) {
            res.status(403).send({
                err_code: 403,
                err_msg: 'You do not have the permission to access this page, please sign in.'
            });
            return false;
        } else {
            res.redirect('/users/login?callback_url='+encodeURIComponent(req.originalUrl||'/'));
        }
    } else if (key && !session.permission[key] && session.user != 'tmrwh' && key != "matrix") {
        if (opt.isApi) {
            res.status(403).send({
                err_code: 403,
                err_msg: 'You do not have the permission to access this page.'
            });
            return false;
        } else {
            res.redirect('/users/login?callback_url='+encodeURIComponent(req.originalUrl||'/'));
            return false;
        }
    } else {
        return true;
    }
}