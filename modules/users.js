var mongodb = require(__base + 'modules/db');
var md5 = require('md5');
var extend = require(__base + 'modules/extend');
var u = {
    login: function(username, password, successful, failed) {
        mongodb(function(db) {
            db.collection('user').find({
                'username': username,
                'password': md5(password),
                'enable': true
            }).toArray(function(err, data) {
                if (err) {
                    return console.log(err); //失败！返回 err
                }
                if (data.length > 0) {
                    //mongodb.close();
                    var res = {
                        'username': data[0].username,
                        'permission': data[0].permission
                    };
                    if (successful) {
                        successful(res);
                    }
                } else {
                    db.collection('user').find().count(function(err, data) {
                        if (err) {
                            return console.log(err); //失败！返回 err
                        }
                        var permission = {
                            sources: true,
                            analytics_news: true,
                            analytics_users: true,
                            permission: true
                        };
                        if (data == 0) {
                            db.collection('user').insert({
                                'username': username,
                                'password': md5(password),
                                'permission': permission,
                                'enable': true
                            }, function(err, res) {
                                if (err) {
                                    console.log('Error:' + err);
                                    return;
                                }
                                db.close();
                                var res = {
                                    'username': username,
                                    'password': md5(password),
                                    'permission': permission
                                };
                                delete res.password;
                                if (successful) {
                                    successful(res);
                                }
                            });
                        } else {
                            db.close();
                            if (failed) {
                                failed();
                            }
                        }
                    });
                }
            });
        });
    },
    list: function(params, callback) {
        var defOpt = {
            page: 1,
            countPerPage: 20
        };
        var opt = extend(true, {}, defOpt, params || {});
        var _this = this;
        mongodb(function(db) {
            var query = {
                enable: true,
            };
            if (params.username) {
                query.username = params.username;
            }
            for (i in opt) {
                if (i == "countPerPage" || i == "page") {
                    opt[i] = parseInt(opt[i]);
                }
            }
            db.collection('user').find(query).count(function(err, data) {
                if (err) {
                    return console.log(err); //失败！返回 err
                }
                var d = {
                    count: data,
                    query: query,
                    page: opt.page,
                    countPerPage: opt.countPerPage
                };
                db.collection('user').find(query).sort({
                    _id: -1
                }).skip((opt.page - 1) * opt.countPerPage).limit(opt.countPerPage).toArray(function(err, data) {
                    db.close();
                    if (err) {
                        return console.log(err); //失败！返回 err
                    }
                    d.data = [];
                    for (i in data) {
                        d.data[i] = {};
                        d.data[i].id = data[i]._id;
                        d.data[i].username = data[i].username;
                        d.data[i].permission = data[i].permission;
                    }
                    if (callback) {
                        callback(d);
                    }
                });
            });
        });
    },
    insert: function(params, cb) {
        mongodb(function(db) {
            var checkSource = function(callback) {
                db.collection('user').find({
                    'username': params.username,
                    'enable': true
                }).toArray(function(err, data) {
                    ////mongodb.close();
                    if (err) {
                        if (cb) {
                            cb(err);
                        }
                        return console.log(err); //失败！返回 err
                    }
                    if (data.length > 0) {
                        if (cb) {
                            cb({
                                err_code: 2,
                                err_msg: 'User is aleady in datebase.',
                                data: params
                            });
                        }
                    } else {
                        callback();
                    }
                });
            }
            var insertSource = function() {
                params.password = md5(params.password);
                params.enable = true;
                db.collection('user').insert(params, function(err, res) {
                    if (err) {
                        console.log('Error:' + err);
                        return;
                    }
                    db.close();
                    if (cb) {
                        delete params.password;
                        cb({
                            err_code: 0,
                            data: params,
                            err_msg: 'Insert success!'
                        });
                    }
                });
            }
            checkSource(function() {
                insertSource();
            });
        });
    },
    update: function(params, user, cb) {
        if (params.password) {
            params.password = md5(params.password);
        }
        mongodb(function(db) {
            var updateSource = function() {
                var whereStr = {
                    "username": user
                };
                var updateStr = {
                    $set: params
                };
                db.collection('user').update(whereStr, updateStr, function(err, res) {
                    if (err) {
                        console.log('Error:' + err);
                        return;
                    }
                    //mongodb.close();
                    if (cb) {
                        cb({
                            err_code: 0,
                            err_msg: "update success"
                        });
                    }
                });
            }
            updateSource();
        });
    }
};
module.exports = u;