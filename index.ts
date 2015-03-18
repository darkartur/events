class Event {

    add(): Event {
        var child: Event = new Event();
        this.children.push(child);
        return child;
    }

    on(handler: () => void): Event {
        this.addHandler(handler);
        return this;
    }

    once(handler: () => void): Event {
        this.addHandler(handler, true);
        return this;
    }

    trigger(): Event {
        this.handlers.forEach((handler: Handler) => {
            handler.callback();
            if (handler.once) {
                this.off(handler.callback)
            }
        });
        return this;
    }

    off(handler?: () => void): Event {
        this.handlers = this.handlers.filter((someHandler: Handler) => {
            var listener: Event = someHandler.listener;

            if (isSameOrFalsy(someHandler.callback, handler)) {
                if (listener) {
                    listener.removeListening(this, someHandler.callback)
                }

                return false;
            }

            return true;
        });

        this.children.forEach((child: Event) => {
            child.off();
        });

        return this;
    }

    listenTo(source: Event, handler: () => void): Event {
        source.addHandler(handler, false, this);
        this.listenings.push({
            source: source,
            handler: handler
        });
        return this;
    }

    listenToOnce(source: Event, handler: () => void): Event {
        source.addHandler(handler, true, this);
        this.listenings.push({
            source: source,
            handler: handler
        });
        return this;
    }

    stopListening(source?: Event, handler?: () => void): Event {
        this.listenings.forEach((listening: Listening) => {
            if (isSameOrFalsy(listening.source, source) && isSameOrFalsy(listening.handler, handler)) {
                listening.source.off(listening.handler);
                return false;
            }

            return true;
        });

        return this;
    }

    private addHandler(callback: () => void, once: boolean = false, listener?: Event) {
        this.handlers.push({
            callback: callback,
            once: once,
            listener: listener
        });
    }

    private removeListening(source: Event, handler: () => void) {
        this.listenings.filter((listening: Listening) => {
            return listening.handler != handler || listening.source != source;
        });
    }

    private children: Event[] = [];
    private handlers: Array<Handler> = [];
    private listenings: Array<Listening> = [];
}

interface Listening {
    source: Event;
    handler: () => void;
}

interface Handler {
    callback: () => void;
    once: boolean;
    listener: Event;
}

function isSameOrFalsy(staff, same_or_falsy) {
    return !same_or_falsy || staff == same_or_falsy;
}

export = Event;