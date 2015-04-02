/// <reference path="typings/mocha/mocha.d.ts" />
/// <reference path="./typings/node/node.d.ts" />
/// <reference path="./typings/expect/expect.d.ts" />
/// <reference path="./index.ts" />

describe("events", () => {

    describe("single event", () => {

        var event: Howl.Event<void>;

        beforeEach(() => {
            event = new Howl.Event<void>();
        });

        it("on and trigger", (done) => {
            event.listen(done);
            event.trigger();
        });

        it("multiple callbacks", () => {
            var fire_a: boolean = false,
                fire_b: boolean = false;

            event.listen(() => {
                fire_a = true;
            });

            event.listen(() => {
                fire_b = true;
            });

            event.trigger();

            expect(fire_a).to.be(true);
            expect(fire_b).to.be(true);
        });

        it("multiple trigger", () => {
            var counter: number = 0;

            event.listen(() => {
                counter++;
            });

            event.trigger();
            event.trigger();
            event.trigger();

            expect(counter).to.be(3);
        });

        it("once", () => {
            var counter: number = 0;

            event.once(() => {
                counter++;
            });

            event.trigger();
            event.trigger();

            expect(counter).to.be(1);
        });

        it("once + on", (done) => {
            event.once(() => {});
            event.listen(done);

            event.trigger();
        });

        it("off", () => {
            var event_is_fired: boolean = false;

            event.listen(() => {
                event_is_fired = true;
            });

            event.off();
            event.trigger();

            expect(event_is_fired).to.be(false);
        });

        it("off target handler", (done) => {
            var disablingHandler: () => void = () => {};

            event.listen(disablingHandler);
            event.listen(done);

            event.off(disablingHandler);
            event.trigger();
        });

        it("toward.listen and stopListening", () => {
            var eventListener: Howl.Event<void> = new Howl.Event<void>(),
                counter: number = 0;

            event.toward(eventListener).listen(() => {
                counter++;
            });

            event.trigger();
            event.trigger();

            eventListener.stopListening(event);

            event.trigger();

            expect(counter).to.be(2);
        });

        it("toward.once", () => {
            var eventListener: Howl.Event<void> = new Howl.Event<void>(),
                counter: number = 0;

            event.toward(eventListener).once(() => {
                counter++;
            });

            event.trigger();
            event.trigger();

            expect(counter).to.be(1);
        });

        it("toward.once and stopListening", () => {
            var eventListener: Howl.Event<void> = new Howl.Event<void>(),
                counter: number = 0;

            event.toward(eventListener).once(() => {
                counter++;
            });

            eventListener.stopListening(event);

            event.trigger();

            expect(counter).to.be(0);
        });

        it("stopListening should off only listener handlers", (done) => {
            var eventListener: Howl.Event<void> = new Howl.Event<void>();

            event.listen(done);

            eventListener.stopListening(event);
            event.trigger();
        });

        it("stopListening target handler", (done) => {
            var event_listener: Howl.Event<void> = new Howl.Event<void>(),
                disablingHandler: () => void = () => {};

            event.toward(event_listener).listen(disablingHandler);
            event.toward(event_listener).listen(done);

            event_listener.stopListening(event, disablingHandler);
            event.trigger();
        });

        it("stopListening all", () => {
            var listener: Howl.Event<void> = new Howl.Event<void>(),
                other_event: Howl.Event<void> = new Howl.Event<void>(),
                is_fired: boolean = false;

            function cb() {
                is_fired = true;
            }

            event.toward(listener).listen(cb);
            other_event.toward(listener).listen(cb);

            listener.stopListening();

            event.trigger();
            other_event.trigger();

            expect(is_fired).to.be(false);
        });

    });

    describe("hierarchical events", () => {

        it("tree off", () => {
            var root: Howl.Event<void>,
                childA: Howl.Event<void>,
                childB: Howl.Event<void>,
                is_fired: boolean = false;

            function handler() {
                is_fired = true;
            }

            root = new Howl.Event<void>();
            childA = root.add<void>();
            childB = root.add<void>();

            childA.listen(handler);
            childB.listen(handler);

            root.off();

            childA.trigger();
            childB.trigger();

            expect(is_fired).to.be(false);
        });

        it("tree trigger", (done) => {
            var parent: Howl.Event<void> = new Howl.Event<void>(),
                child: Howl.Event<void> = parent.add<void>();

            parent.listen(done);
            child.trigger();
        });

        it("stopListening should affect source children", () => {
            var listener: Howl.Event<void> = new Howl.Event<void>(),
                parent: Howl.Event<void> = new Howl.Event<void>(),
                child: Howl.Event<void> = parent.add<void>(),
                is_fired: boolean = false;

            child.toward(listener).listen(() => {
                is_fired = true;
            });

            listener.stopListening(parent);

            child.trigger();

            expect(is_fired).to.be(false);
        });

        it("stopListening should affect listener children", () => {
            var source: Howl.Event<void> = new Howl.Event<void>(),
                parent: Howl.Event<void> = new Howl.Event<void>(),
                child: Howl.Event<void> = parent.add<void>(),
                is_fired: boolean = false;

            source.toward(child).listen(() => {
                is_fired = true;
            });

            parent.stopListening(source);

            source.trigger();

            expect(is_fired).to.be(false);
        });

    });

    describe("events with parameter", () => {
        var event: Howl.Event<number>;

        beforeEach(() => {
            event = new Howl.Event<number>();
        });

        it("on", () => {
            var fired_value: number = null;

            event.listen((param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("once", () => {
            var fired_value: number = null;

            event.once((param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("toward.listen", () => {
            var fired_value: number = null,
                listener: Howl.Event<number> = new Howl.Event<number>();

            event.toward(listener).listen((param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("toward.once", () => {
            var fired_value: number = null,
                listener: Howl.Event<number> = new Howl.Event<number>();

            event.toward(listener).once((param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("parameters in tree", () => {
            var parent: Howl.Event<string>,
                child: Howl.Event<void>,
                fired_parameter: string = null;

            parent = new Howl.Event<string>();
            child = parent.add<void>("test");

            parent.listen((param: string) => {
                fired_parameter = param;
            });

            child.trigger();

            expect(fired_parameter).to.be("test");
        });

    });

});