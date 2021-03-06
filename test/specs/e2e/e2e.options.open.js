"use strict";

var browserSync = require("../../../index");
var utils = require("../../../lib/utils");

var assert = require("chai").assert;
var sinon = require("sinon");

describe("E2E OPEN options", function () {

    var instance;
    var stub;

    before(function (done) {
        browserSync.reset();
        var config = {
            logLevel: "silent",
            server:    "test/fixtures"
        };
        stub = sinon.stub(utils, "open");
        instance = browserSync(config, done).instance;
    });

    after(function () {
        instance.cleanup();
        stub.restore();
    });

    it("Opens the localhost address as default", function () {
        var args = stub.getCall(0).args;
        sinon.assert.called(stub);
        assert.equal(args[0], instance.options.getIn(["urls", "local"]));
    });
});

describe("E2E OPEN options with external", function () {

    var bs;
    var stub;
    var opnPath;
    var opnStub;

    before(function (done) {
        browserSync.reset();
        var config = {
            logLevel: "silent",
            server:    "test/fixtures",
            open:      "local"
        };
        stub = sinon.spy(utils, "open");
        opnPath = require.resolve("opn");
        require(opnPath);
        opnStub = require("sinon").stub(require.cache[opnPath], "exports");
        bs = browserSync(config, done).instance;
    });

    after(function () {
        bs.cleanup();
        stub.restore();
    });

    it("Opens the external address when specified in options", function () {
        sinon.assert.calledWith(opnStub, bs.options.getIn(["urls", "local"]));
        require.cache[opnPath].exports.restore();
    });
});
