window.modulesK2V = function(key) {
    var kv = {
        sources: "Source Management",
        analytics_news: "News Analytics",
        analytics_users: "User Analytics",
        permission: "Permission Management",
        contents: "Content verification",
        templates: "Templates verification",
        push: "Push Management",
        feedback: "Feedback Management",
        retention: "Retention",
        release: "Release",
        usage: "Usage",
        data: "data",
        analytics: "Analytics"
    };
    if (!key) {
        return kv;
    } else {
        return kv[key] || key;
    }
};
window.categorys = ["Entertainment", "Cricket", "Auto", "Jokes", "Politics", "Technology", "Health", "Lifestyle", "Sports", "Education", "Business", "National", "World", "entertainment", "cricket", "auto", "jokes", "politics", "technology", "health", "lifestyle", "sports", "education", "business", "national", "world"];
Number.prototype.toThousands = function() {
    var num = (this || 0).toString(),
        result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}
ArrayFilter = function(arr1, arr) {
    if (!arr1) {
        arr1 = [];
    }
    if (!arr) {
        arr = [];
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr.indexOf(arr1[i]) <= -1) {
            arr1.splice(i, 1);
            i--;
        }
    }
    return arr1;
}
$(function() {
    var clearCache = function(url) {
        var _time = Date.parse(new Date());
        return (url.indexOf("?") > -1) ? url + '&_=' + _time : url + '?_=' + _time;
    }
    var httpError = function(code) {
        if (code >= 500) {
            console.error('500: Server Error');
            return false;
        } else if (code == 404) {
            console.error('404: Not Found');
            return false;
        }
        return true;
    }
    $.get = function(url, params, callback, type) {
        if ($.isFunction(params)) {
            callback = params;
            params = undefined;
        }
        type == 'json' ? 'json' : 'form';
        var ajaxParams = {
            type: 'GET',
            url: clearCache(url),
            dataType: 'json',
            data: params,
            success: function(data, status, xhr) {
                callback(data, xhr.status);
            },
            error: function(xhr, errorType, error) {
                if (typeof(xhr.response) == 'string') {
                    try {
                        var response = eval("(" + xhr.responseText + ")");
                    } catch (e) {
                        var response = {};
                    }
                }
                if (httpError(xhr.status)) {
                    callback(response, xhr.status, xhr);
                }
            }
        };
        if (type == "json") {
            ajaxParams.contentType = "application/json";
            ajaxParams.data = JSON.stringify(params);
        }
        $.ajax(ajaxParams);
    };
    $.post = function(url, params, callback, type) {
        if ($.isFunction(params)) {
            callback = params;
            params = undefined;
            type = callback;
        }
        var _time = Date.parse(new Date());
        type == 'json' ? 'json' : 'form';
        var ajaxParams = {
            type: 'POST',
            url: clearCache(url),
            dataType: 'json',
            data: params,
            success: function(data, status, xhr) {
                callback(data, xhr.status);
            },
            error: function(xhr, errorType, error) {
                if (typeof(xhr.response) == 'string') {
                    try {
                        var response = eval("(" + xhr.response + ")");
                    } catch (e) {
                        var response = {};
                    }
                }
                if (httpError(xhr.status)) {
                    callback(response, xhr.status, xhr);
                }
            }
        };
        if (type == "json") {
            ajaxParams.contentType = "application/json";
            ajaxParams.data = JSON.stringify(params);
        }
        $.ajax(ajaxParams);
    };
    $.patch = function(url, params, callback) {
        if ($.isFunction(params)) {
            callback = params;
            params = undefined;
        }
        var _time = Date.parse(new Date());
        var ajaxParams = {
            type: 'PATCH',
            url: clearCache(url),
            dataType: 'json',
            contentType: "application/json",
            headers: {
                'X-HTTP-Method-Override': 'PATCH'
            },
            data: JSON.stringify(params),
            success: function(data, status, xhr) {
                callback(data, xhr.status);
            },
            error: function(xhr, errorType, error) {
                if (typeof(xhr.response) == 'string') {
                    try {
                        var response = eval("(" + xhr.response + ")");
                    } catch (e) {
                        var response = {};
                    }
                }
                if (httpError(xhr.status)) {
                    callback(response, xhr.status, xhr);
                }
            }
        };
        $.ajax(ajaxParams);
    };
    $.upload = function(url, formData, callback, progress) {
        if ($.isFunction(formData)) {
            callback = formData;
            formData = undefined;
        }
        var _time = Date.parse(new Date());
        var ajaxParams = {
            type: 'POST',
            url: url,
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            xhr: function() {
                var xhrobj = $.ajaxSettings.xhr();
                if (xhrobj.upload) {
                    xhrobj.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total || e.totalSize;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        if (progress) {
                            progress(percent);
                        }
                    }, false);
                }
                return xhrobj;
            },
            complete: function(xhr, textStatus) {
                var response = xhr.responseJSON;
                //console.log('complete');
                callback(response, xhr.status, xhr);
            },
            success: function(data, status, xhr) {
                //console.log('success');
                //callback(data,xhr.status);
            },
            error: function(xhr, errorType, error) {
                if (typeof(xhr.response) == 'string') {
                    try {
                        var response = eval("(" + xhr.response + ")");
                    } catch (e) {
                        var response = {};
                    }
                }
                if (httpError(xhr.status)) {
                    callback(response, xhr.status, xhr);
                }
            }
        };
        $.ajax(ajaxParams);
    }
    $.put = function(url, params, callback, type) {
        if ($.isFunction(params)) {
            callback = params;
            params = undefined;
            type = callback;
        }
        var _time = Date.parse(new Date());
        type == 'json' ? 'json' : 'form';
        var ajaxParams = {
            type: 'PUT',
            url: clearCache(url),
            dataType: 'json',
            headers: {
                'X-HTTP-Method-Override': 'PUT'
            },
            data: params,
            success: function(data, status, xhr) {
                callback(data, xhr.status);
            },
            error: function(xhr, errorType, error) {
                if (typeof(xhr.response) == 'string') {
                    try {
                        var response = eval("(" + xhr.response + ")");
                    } catch (e) {
                        var response = {};
                    }
                }
                if (httpError(xhr.status)) {
                    callback(response, xhr.status, xhr);
                }
            }
        };
        if (type == "json") {
            ajaxParams.contentType = "application/json";
            ajaxParams.data = JSON.stringify(params);
        }
        $.ajax(ajaxParams);
    };
    $.del = function(url, params, callback, type) {
        if ($.isFunction(params)) {
            callback = params;
            params = undefined;
        }
        var _time = Date.parse(new Date());
        var ajaxParams = {
            type: 'DELETE',
            url: clearCache(url),
            dataType: 'json',
            headers: {
                'X-HTTP-Method-Override': 'DELETE'
            },
            data: params,
            success: function(data, status, xhr) {
                callback(data, xhr.status);
            },
            error: function(xhr, errorType, error) {
                if (typeof(xhr.response) == 'string') {
                    try {
                        var response = eval("(" + xhr.response + ")");
                    } catch (e) {
                        var response = {};
                    }
                }
                if (httpError(xhr.status)) {
                    callback(response, xhr.status, xhr);
                }
            }
        };
        if (type == "json") {
            ajaxParams.contentType = "application/json";
            ajaxParams.data = JSON.stringify(params);
        }
        $.ajax(ajaxParams);
    };
    $.fn.renderChart = function(opt) {
        var defOpt = {
            colors: ['#4096B5', '#ED7054', '#47C6C9', '#E5A653', '#399960', '#CC4A5A', '#9BAD4E', '#DB4F82', '#7E58AF', '#CC5CB7'],
            tooltip: {
                enabled: true
            },
            legend: {
                margin: 25,
                enabled: true
            },
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: ' '
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            subtitle: {},
            credits: {
                enabled: false
            },
        };
        opt = $.extend(true, {}, defOpt, opt || {});
        if (opt.filename) {
            var filename = opt.filename;
            delete opt.filename;
        } else {
            var filename = new Date().getTime() + '_' + parseInt(Math.random() * 100000);
        }
        if (opt.export) {
            var _export = true;
        } else {
            var _export = false;
        }
        delete opt.export;
        var c = this.highcharts(opt);
        if (_export) {
            var exportBtn = $('<a style="float:right;margin-top:-40px;" class="btn btn-default exportBtn">Export</a>');
            var CSV = "";
            var csvData = {
                row: opt.series,
                col: opt.xAxis.categories
            };
            var excel = [],
                rows = new Array();
            rows.push(' ');
            for (var i = 0, len = csvData.row.length; i < len; i++) {
                rows.push(csvData.row[i].name);
            }
            excel.push(rows);
            for (var i = 0, col_len = csvData.col.length; i < col_len; i++) {
                var cols = new Array();
                cols.push(csvData.col[i]);
                for (var j = 0, row_len = csvData.row.length; j < row_len; j++) {
                    cols.push(csvData.row[j].data[i]);
                }
                excel.push(cols);
            }
            for (var i = 0; i < excel.length; i++) {
                var row = "";
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in excel[i]) {
                    row += ((typeof(excel[i][index]) == "object")?excel[i][index].y:excel[i][index]) + ',';
                }
                row.slice(0, row.length - 1);
                //add a line break after each row
                CSV += row + '\r\n';
            }
            blob = new Blob([CSV], {
                type: 'text/csv'
            });
            var csvUrl = window.URL.createObjectURL(blob);
            //var filename = 'UserExport.csv';
            exportBtn.attr({
                'download': filename + '.csv',
                'href': csvUrl
            });
            $(this).closest(".section").find(".section-header").find(".exportBtn").remove();
            $(this).closest(".section").find(".section-header").append(exportBtn);
        }
        return c;
    }
});
$(function() {
    /*$(".leftNav").on("click","a",function(i,e){
        $(this).addClass("active").siblings("a").removeClass("active");
        $(".mainSection").find(".section-"+$(this).data("for")).removeClass("hidden").siblings(".section").addClass("hidden");
    })*/
    $.fn.multiSel = function() {
        var _this = this;
        if (_this.find("ul:nth-child(1)").length == 0) {
            var unSelBox = $('<ul></ul>');
            _this.append(unSelBox);
        } else {
            var unSelBox = _this.find("ul:nth-child(1)");
        }
        if (_this.find("ul:nth-child(2)").length == 0) {
            var selectedBox = $('<ul></ul>');
            _this.append(selectedBox);
        } else {
            var selectedBox = _this.find("ul:nth-child(2)");
        }
        var changeData = function() {
            var data = [];
            selectedBox.find("li").each(function() {
                data.push($(this).data("value"));
            });
            _this.data("value", data);
        }
        unSelBox.on("click", 'li', function() {
            selectedBox.append($(this));
            changeData();
        });
        selectedBox.on("click", 'li', function() {
            unSelBox.append($(this));
            changeData();
        });
    }
    $.fn.multiSelVal = function(sets) {
        var _this = this;
        if (_this.find("ul:nth-child(1)").length == 0) {
            var unSelBox = $('<ul></ul>');
            _this.append(unSelBox);
        } else {
            var unSelBox = _this.find("ul:nth-child(1)");
        }
        if (_this.find("ul:nth-child(2)").length == 0) {
            var selectedBox = $('<ul></ul>');
            _this.append(selectedBox);
        } else {
            var selectedBox = _this.find("ul:nth-child(2)");
        }
        if (typeof(sets) == "undefined") {
            return _this.data("value");
        } else {
            if (typeof(sets) == "string") {
                sets = sets.split(",");
            }
            unSelBox.find("li").each(function() {
                if (sets.indexOf($(this).data("value")) > -1) {
                    selectedBox.append($(this));
                }
            });
            selectedBox.find("li").each(function() {
                if (sets.indexOf($(this).data("value")) <= -1) {
                    unSelBox.append($(this));
                }
            });
        }
    }
    $(".multiSel").multiSel();
    $(".actionBar").on("click", "button", function() {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active").siblings("button").removeClass("active");
            $(".mainSection").find(".action-" + $(this).data("for")).removeClass("hidden").siblings(".action").addClass("hidden");
        } else {
            $(this).removeClass("active");
            $(".mainSection").find(".action-" + $(this).data("for")).addClass("hidden");
        }
    });
    $.fn.ajaxBlock = function() {
        if ($(this).find('.block').length > 0) {
            $(this).find('.block').data('block-num', $(this).find('.block').data('block-num') + 1);
        } else {
            $(this).append('<div class="block" data-block-num="1"></div>');
        }
    };
    $.fn.unblock = function() {
        if ($(this).find('.block').length > 0) {
            if ($(this).find('.block').data('block-num') > 1) {
                $(this).find('.block').data('block-num', $(this).find('.block').data('block-num') - 1);
            } else {
                $(this).find('.block').remove();
            }
        }
    };
    $.fn.renderPageNav = function(d, callback) {
        var ele = $(this);
        ele.empty();
        var totalNum = d.count;
        var page = d.page;
        var countPerPage = d.countPerPage || d.cpp;
        var totalPage = Math.ceil(totalNum / countPerPage);
        var pageNavMoreCount = 5;
        var renderPageNavI = function(i) {
            if (i == page) {
                var res = $('<li><span class="active" data-page="' + i + '">' + i + '</span></li>');
            } else {
                var res = $('<li><a data-page="' + i + '">' + i + '</a></li>');
            }
            return res;
        }
        if (page > 1) {
            ele.append('<li>\
                <a data-page="' + (page - 1) + '">\
                    <span aria-hidden="true">&laquo;</span>\
                </a>\
            </li>');
        }
        for (var i = 1; i < Math.min(page - pageNavMoreCount, 1 + pageNavMoreCount); i++) {
            ele.append(renderPageNavI(i));
        }
        if (page - pageNavMoreCount > 1 + pageNavMoreCount) {
            ele.append('<li><span>...<span></li>');
        }
        for (var i = Math.max(page - pageNavMoreCount, 1); i <= Math.min(page + pageNavMoreCount, totalPage); i++) {
            ele.append(renderPageNavI(i));
        }
        if (totalPage - pageNavMoreCount + 1 > i + pageNavMoreCount) {
            ele.append('<li><span>...</span></li>');
        }
        for (var i = Math.max(totalPage - pageNavMoreCount, page + pageNavMoreCount) + 1; i <= totalPage; i++) {
            ele.append(renderPageNavI(i));
        }
        if (page < totalPage) {
            ele.append('<li>\
                <a data-page="' + (page + 1) + '">\
                    <span>&raquo;</span>\
                </a>\
            </li>');
        }
        ele.unbind().one('click', 'a', function() {
            console.log($(this).data('page'));
            if (callback) {
                callback($(this).data('page'));
            }
        })
    }
    $.fn.uploadImg = function(params) {
        var defOpt = {};
        var opt = $.extend(true, defOpt, params || {});
        $(this).each(function() {
            var _this = $(this);
            var input = $('<input type="file" />');
            _this.append(input);
            input.change(function() {
                if ($(this)[0].files.length < 1) {
                    return false;
                }
                if ($(this)[0].files["0"].type.indexOf("image") == -1) {
                    alert("上传文件格式有误");
                    return false;
                }
                _this.addClass("uploading");
                _this.ajaxBlock();
                var postImgUrl = opt.url;
                var fileData = new FormData();
                fileData.append(opt.key, $(this)[0].files[0]);
                _this.css("background-image", "").removeClass("hasPic");
                fileData.append("type", opt.type);
                $.upload(postImgUrl, fileData, function(i, code) {
                    _this.unblock();
                    if (i.err_code) {
                        alert("上传图片出错，请重新上传");
                        return false;
                    } else {
                        _this.css("background-image", 'url(' + i.origin + ')').removeClass("uploading").removeClass("loadingPic").addClass("hasPic").data("val", i.origin);
                        if (opt.callback) {
                            i.dom = _this;
                            opt.callback(i);
                        }
                    }
                }, function(percent) {
                    _this.find(".percent").text(percent);
                    if (percent == 100) {
                        _this.removeClass("uploading").addClass("loadingPic");
                    }
                });
            });
        });
    }
    $.fn.tip = function(text, type, opt) {
        var defOpt = {
            autoRemove: 3000
        };
        var types = {
            "success": {
                "text": "Success",
                "class": "success"
            },
            "error": {
                "text": "Error",
                "class": "danger"
            }
        };
        if (!type) {
            type = 'success';
        }
        opt = $.extend({}, defOpt, opt || {});
        var alert = $('<div class="alert alert-' + types[type].class + ' alert-dismissible" role="alert">\
<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
<strong>' + types[type].text + '!</strong> ' + text + '\
</div>');
        $(this).append(alert);
        if (opt.autoRemove > 0) {
            setTimeout(function() {
                alert.remove();
            }, opt.autoRemove);
        }
    }
    $(".input-group").on("keypress", "input", function(e) {
        if (e.keyCode == 13) {
            $(this).closest(".input-group").find("button").click();
        }
    });
});

Date.prototype.Format = function(fmt, timezone, showTimezone) {
    if (!timezone) {
        timezone = '+0800';
    }
    var timezoneOffset = 0 - parseInt(parseInt(timezone) / 100) * 60 - parseInt(parseInt(timezone) % 100);
    timezoneOffset = timezoneOffset - this.getTimezoneOffset();
    var theDate = new Date(this - timezoneOffset * 60 * 1000);
    var o = {
        "M+": theDate.getMonth() + 1, //月份
        "d+": theDate.getDate(), //日
        "h+": theDate.getHours(), //小时
        "m+": theDate.getMinutes(), //分
        "s+": theDate.getSeconds(), //秒
        "q+": Math.floor((theDate.getMonth() + 3) / 3), //季度
        "S": theDate.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (theDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return showTimezone ? fmt + " GMT" + timezone : fmt;
}