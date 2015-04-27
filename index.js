(function() {
    "use strict";

    var apiHost = "api.aplatform.ru";
    var request = require("./httpApi"),
        md5 = require("MD5"),
        _ = require("lodash");

    function apiMethod(method, paramNames) {
        return function() {
            var api = this;
            var args = _.toArray(arguments);
            var params, cb;
            if (typeof args[1] === "function") {
                cb = args[1];
                params = args[0];
            } else {
                cb = args.pop();
                params = _.zipObject(paramNames, args);
            }
            api.request(method, params, cb);
        };
    }

    function MambaApi(appId, appSecret, appPrivate) {
        this.appId = appId;
        this.appSecret = appSecret;
        this.appPrivate = appPrivate;
    }

    MambaApi.prototype.constructBody = function(params) {
        var hash, body;
        hash = body = "";
        params.app_id = this.appId;
        params.secure = params.secure || "1";
        var keys = Object.keys(params);
        keys.sort();
        _.each(keys, function(k) {
            hash += k + "=" + params[k];
            body += k + "=" + encodeURIComponent(params[k]) + "&";
        });
        if (params.secure) {
            body += "sig=" + md5(hash + this.appSecret);
        } else {
            body += "sig=" + md5(params.oid + hash + this.appPrivate);
        }
        return body;
    };

    MambaApi.prototype.request = function(method, params, cb) {
        if (typeof method === "object") {
            cb = params;
            params = method;
        } else {
            params.method = method;
        }
        var body = this.constructBody(params);
        request({
            host: apiHost,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": body.length
            }
        }, body, function(err, res) {
            if (!res || isNaN(res.status) || res.status !== 0) {
                err = new Error(res.message);
            }
            var data;
            try {
                data = JSON.parse(res.message);
            } catch (e) {
                data = res.message;
            }
            cb(err, data);
        });
    };

    MambaApi.prototype.achievementSet = apiMethod("achievement.set", ["sid", "text", "extra_params"]);
    MambaApi.prototype.anketaGetFlags = apiMethod("anketa.getFlags", ["oids"]);
    MambaApi.prototype.anketaGetHitlist = apiMethod("anketa.getHitlist", ["sid", "period", "limit", "offset", "blocks", "ids_only"]);
    MambaApi.prototype.anketaGetInfo = apiMethod("anketa.getInfo", ["sid", "oids", "logins", "blocks"]);
    MambaApi.prototype.anketaGetInterests = apiMethod("anketa.getInterests", ["oid"]);
    MambaApi.prototype.anketaGetTravel = apiMethod("anketa.getTravel", ["oid"]);
    MambaApi.prototype.anketaInFavourites = apiMethod("anketa.inFavourites", ["sid"]);
    MambaApi.prototype.anketaIsAppOwner = apiMethod("anketa.isAppOwner", ["sid"]);
    MambaApi.prototype.anketaIsAppUser = apiMethod("anketa.isAppUser", ["oids"]);
    MambaApi.prototype.anketaIsOnline = apiMethod("anketa.isOnline", ["oids"]);
    MambaApi.prototype.contactsGetContactList = apiMethod("contacts.getContactList", ["sid", "online", "limit", "blocks", "ids_only"]);
    MambaApi.prototype.contactsGetFolderContactList = apiMethod("contacts.getFolderContactList", ["sid", "folder_id",
        "online", "limit", "offset", "blocks", "ids_only"
    ]);
    MambaApi.prototype.contactsGetFolderList = apiMethod("contacts.getFolderList", ["sid"]);
    MambaApi.prototype.contactsSendMessage = apiMethod("contacts.sendMessage", ["sid", "oid", "message", "extra_params"]);
    MambaApi.prototype.diaryGetPosts = apiMethod("diary.getPosts", ["oid", "offset", "sid"]);
    MambaApi.prototype.geoGetCities = apiMethod("geo.getCities", ["region_id"]);
    MambaApi.prototype.geoGetCountries = apiMethod("geo.getCountries", []);
    MambaApi.prototype.geoGetMetro = apiMethod("geo.getMetro", ["city_id"]);
    MambaApi.prototype.geoGetRegions = apiMethod("geo.getRegions", ["country_id"]);
    MambaApi.prototype.notifySendMessage = apiMethod("notify.sendMessage", ["oids", "sid", "message", "extra_params"]);
    MambaApi.prototype.photosGet = apiMethod("photos.get", ["oid", "sid", "album_id"]);
    MambaApi.prototype.photosGetAlbums = apiMethod("photos.getAlbums", ["oid", "sid"]);
    MambaApi.prototype.searchGet = apiMethod("search.get", ["iam", "look_for", "age_from", "age_to", "with_photo",
        "real_only", "with_web_camera", "country_id", "region_id", "city_id", "metro_id", "offset", "blocks", "ids_only", "sid", "same_interests"
    ]);

    module.exports = MambaApi;

}());
