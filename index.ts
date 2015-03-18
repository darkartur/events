class Event {

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
        this.handlers = handler ? this.handlers.filter((someHandler) => {
            return someHandler.callback !== handler;
        }) : [];
        return this;
    }

    listenTo(source: Event, handler: () => void): Event {
        source.on(handler);
        this.listenings.push({
            source: source,
            handler: handler
        });
        return this;
    }

    stopListening(source?: Event, handler?: () => void): Event {
        this.listenings = this.listenings.filter((listening: Listening) => {
            if (isSameOrFalsy(listening.source, source) && isSameOrFalsy(listening.handler, handler)) {
                listening.source.off(listening.handler);
                return false;
            }

            return true;
        });

        return this;
    }

    private addHandler(callback: () => void, once: boolean = false) {
        this.handlers.push({
            callback: callback,
            once: once
        });
    }

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
}

function isSameOrFalsy(staff, same_or_falsy) {
    return !same_or_falsy || staff == same_or_falsy;
}

export = Event;