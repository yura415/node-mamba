(function () {
    "use strict";
    var http = require("http");

    function httpRequestCallback(actualCallback) {
        return function (res) {
            var str = "";
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                str += chunk;
            });
            res.on("end", function () {
                var data;
                try {
                    data = JSON.parse(str);
                } catch (e) {
                    data = str;
                }
                actualCallback(null, data);
            });
        };
    }

    module.exports = function (options, postData, cb) {
        if (typeof postData === "function") {
            cb = postData;
            postData = null;
        }
        var req = http.request(options, httpRequestCallback(cb));
        if (postData) {
            req.write(postData);
        }
        req.on("error", function (e) {
            cb(e);
        });
        req.end();
    };

}());
