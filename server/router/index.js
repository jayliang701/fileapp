var Setting = global.SETTING;
var Utils = require("weroll/utils/Utils");
var ViewEngineFilter = require("weroll/utils/ViewEngineFilter");

ViewEngineFilter.addFilter("json", json);
ViewEngineFilter.addFilter("oss", oss);
ViewEngineFilter.addFilter("ossHead", ossHead);

function json(val, express) {
    return this.env.getFilter("safe")(JSON.stringify(val));
}

function oss(filename, options) {
    return wrapperOSSUrl(filename, options);
}

function ossHead(filename, gender, size) {
    if (!String(filename).hasValue()) filename = gender == 2 ? 'pic_head_woman.png' : 'pic_head_man.png';
    try {
        var info = parsePhotoInfo(filename);
        if (info) {
            var w = info.width;
            var h = info.height;
            var s = Math.min(w, h);

            filename += '?imageMogr2/gravity/center/crop/' + s + 'x' + s;
        }
        var options = {};
        if (size > 0) {
            options.viewWidth = size;
            options.viewHeight = size;
        }
        return wrapperOSSUrl(filename, options);
    } catch (exp) {
        return '';
    }
}

function wrapperOSSUrl(filename, options) {
    var url = String(filename).trim();
    if (url.indexOf('http') == 0 || url.indexOf('https') == 0) {
        return url;
    }
    var info = parsePhotoInfo(url);
    var ratio = 1;

    if (url.indexOf("?imageMogr2") < 0) url += "?imageMogr2";
    options = options || {};
    if (info) {
        var w = info.width;
        var h = info.height;
        if (options.viewWidth > 0) {
            w = options.viewWidth;
            h = options.viewHeight > 0 ? options.viewHeight : Math.round(options.viewWidth / (info.width / info.height));
        }
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);

        url += '/thumbnail/{0}x{1}' + (options.enforce ? '!' : '');
        url = url.fillData(0, w || '');
        url = url.fillData(1, h || '');
    } else {
        if (options.viewWidth > 0) {
            url += '/thumbnail/{0}x{1}' + (options.enforce ? '!' : '');
            url = url.fillData(0, options.viewWidth * ratio);
            url = url.fillData(1, options.viewHeight ? (options.viewHeight * ratio) : '');
        }
    }
    var domain = Setting.upload.public_domain;
    if (options.type == 'private') domain = Setting.upload.private_domain;
    url = domain + '/' + url;
    if (options.nocache) {
        url += ((url.indexOf("?imageMogr2") > 0 ? "&" : "?") + 'timestamp=' + Date.now());
    }
    return url;
}

function parsePhotoInfo(url) {
    if (!String(url).hasValue()) return null;
    var reg = /-\d+x\d+\./;
    var info = url.match(reg);
    info = info ? info[0] : null;
    if (!info) return null;

    info = info.replace('-','').replace('.','');
    info = info.split('x');
    if (info.length != 2) return null;
    info = { width:Number(info[0]), height:Number(info[1]) };

    return info;
}


function renderIndexPage(req, res, output, user) {
    output({ msg:"hello!" });
}


function renderTestPage() {
    return { msg:"hello!" };
}

exports.getRouterMap = function() {
    return [
        { url: "/", view: "index", handle: renderIndexPage, needLogin:false },
        { url: "/index", view: "index", handle: renderIndexPage, needLogin:false },
        { url: "/test", view: "test", handle: renderTestPage, needLogin:false }
    ];
}
