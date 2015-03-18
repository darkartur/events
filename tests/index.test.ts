/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
require('source-map-support').install();

import assert = require("assert");

import Event = require('../index');

describe("events", () => {

    it("on and trigger", (done) => {
        var event: Event = new Event();

        event.on(done);
        event.trigger();
    })
});