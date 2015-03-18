/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/expect/expect.d.ts" />
require('source-map-support').install();

import expect = require("expect.js");

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

        expect(fire_a).to.be(true);
        expect(fire_b).to.be(true);
    });

    it("off", () => {
        var event_is_fired: boolean = false;

        event.on(() => {
            event_is_fired = true;
        });

        event.off();
        event.trigger();

        expect(event_is_fired).to.be(false);
    });

    it("off target handler", (done) => {
        var disablingHandler: () => void = () => {};

        event.on(disablingHandler);
        event.on(done);

        event.off(disablingHandler);
        event.trigger();
    });

    it("listenTo and stopListening", () => {
        var eventListener: Event = new Event(),
            counter: number = 0;

        eventListener.listenTo(event, () => {
            counter++;
        });

        event.trigger();

        eventListener.stopListening(event);

        expect(counter).to.be(1);
    });

    it("stopListening should off only listener handlers", (done) => {
        var eventListener: Event = new Event();

        event.on(done);

        eventListener.stopListening(event);
        event.trigger();
    });

    it("stopListening target handler", (done) => {
        var event_listener: Event = new Event(),
            disablingHandler: () => void = () => {};

        event_listener.listenTo(event, disablingHandler);
        event_listener.listenTo(event, done);

        event_listener.stopListening(event, disablingHandler);
        event.trigger();
    });

    it("stopListening all", () => {
        var listener: Event = new Event(),
            other_event: Event = new Event(),
            is_fired: boolean = false;

        function cb() {
            is_fired = true;
        }

        listener.listenTo(event, cb);
        listener.listenTo(other_event, cb);

        listener.stopListening();

        event.trigger();
        other_event.trigger();

        expect(is_fired).to.be(false);
    });

});