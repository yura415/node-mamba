process.env.NODE_ENV = "test";

var should = require("should");

describe("api tests", function () {
    "use strict";

    var mambaApi;

    before(function (done) {
        var MambaApi = require("..");
        mambaApi = new MambaApi("2129", "n2l49r06xvOYv6OM3z76", "Mp6QtzjxtY6x5Q94p0U5");
        done();
    });

    it("should send api request", function (done) {
        //noinspection Eslint
        mambaApi.request("search.get", {
            iam: "M",
            look_for: "MM",
            city_id: 123,
            age_from: 18
        }, function (err, res) {
            if (err) {
                throw err;
            }
            should.not.exist(err);
            should.exist(res);
            res.status.should.equal(0);
            done();
        });
    });

    it("should send api request using specific method", function (done) {
        //noinspection Eslint
        mambaApi.searchGet({
            iam: "M",
            look_for: "MM",
            city_id: 123,
            age_from: 18
        }, function (err, res) {
            if (err) {
                throw err;
            }
            should.not.exist(err);
            should.exist(res);
            res.status.should.equal(0);
            done();
        });
    });

});
