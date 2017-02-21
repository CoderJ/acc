var config = require(__base + 'config');
var MongoClient = require('mongodb').MongoClient;
var _mongodb = function(dbOpt, callback) {
    if (typeof(dbOpt) == "function") {
        callback = dbOpt;
        dbOpt = config.db;
    }

    var type = dbOpt.host + '_' + dbOpt.port + '_' + dbOpt.db;

    if (!global.dbPool) {
        global.dbPool = {};
    }
    if (!global.dbPool[type]) {
        MongoClient.connect("mongodb://" + dbOpt.host + ":" + dbOpt.port + "/" + dbOpt.db, {
            "server": {
                "auto_reconnect": true,
                "poolSize": 20,
                "reconnectTries": 86400,
                "reconnectInterval": 1000,
                "socketOptions": {
                    "noDelay": true,
                    "connectTimeoutMS": 30000,
                    "keepAlive": 1,
                    "socketTimeoutMS": 0
                }
            }
        }, function(err, db) {
            if (err) {
                console.log("Mongo connect error: " + dbOpt );
                console.log(err);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            } else {
                global.dbPool[type] = {
                    number: 0,
                    db: db
                };
                db.close = function() {
                    global.dbPool[type].number--;
                    if (global.dbPool[type].number < 0) {
                        global.dbPool[type].number = 0;
                    }
                    return false;
                }
                if (!global.dbPool[type].number) {
                    global.dbPool[type].number = 0;
                }
                if (!global.dbPool[type].interval) {
                    global.dbPool[type].interval = setInterval(function() {
                        if (global.dbPool[type].number > 100) {
                            global.dbPool[type].number--;
                        }
                    }, 100);
                }
                global.dbPool[type].number++;
                callback(db);
            }
        });
    } else {
        if (global.dbPool[type].number > 3000) {
            setTimeout(function() {
                _mongodb(lang, type, callback);
            }, 1000);
        } else {
            global.dbPool[type].number++;
            callback(global.dbPool[type].db);
        }
    }
};
module.exports = _mongodb;