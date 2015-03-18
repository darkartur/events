/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
require('source-map-support').install();

import assert = require("assert");

import Event = require('../index');

describe("events", () => {

    var event: Event;

    beforeEach(() => {
        event = new Event();
    });

    it("on and trigger", (done) => {
        event.on(done);
        event.trigger();
    });

    it("multiple callbacks", () => {
        var fire_a: boolean = false,
            fire_b: boolean = false;

        event.on(() => {
            fire_a = true;
        });

        event.on(() => {
            fire_b = true;
        });

        event.trigger();

        assert.strictEqual(fire_a, true);
        assert.strictEqual(fire_b, true);
    });

});