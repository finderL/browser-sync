"use strict";

var browserSync = require("../../../index");

var connect = require("connect");

var request = require("request");
var assert  = require("chai").assert;

describe("HTTP protocol", function () {

    var bs;

    before(function (done) {

        browserSync.reset();

        var config = {
            server: "test/fixtures",
            logLevel: "info",
            open: false
        };

        bs = browserSync.init(config, done).instance;
    });

    after(function () {
        bs.cleanup();
    });

    it("responds to reload event", function (done) {
        var sinon = require("sinon");
        var spy = sinon.spy(bs.events, "emit");

        var queryString = require("query-string");

        var url = [
            bs.options.getIn(["urls", "local"]),
            "/__browser_sync__?",
            queryString.stringify({method: "reload", args: ["core.min.css", "core.css"]})
        ].join("");

        request(url, function (e, r, body) {
            sinon.assert.calledWith(spy, "file:changed");
            sinon.assert.calledWithExactly(spy, "file:changed", { path: 'core.min.css', log: true, namespace: 'core' });
            assert.include(body, "Called public API method `.reload()`");
            assert.include(body, "With args: [\"core.min.css\",\"core.css\"]");
            done();
        });
    });
});
