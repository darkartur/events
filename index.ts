class Event {

    on(handler: () => void): Event {
        this.handlers.push(handler);
        return this;
    }

    trigger(): Event {
        this.handlers.forEach((handler: () => void) => {
            handler();
        });
        return this;
    }

    off(handler?: () => void): Event {
        this.handlers = handler ? this.handlers.filter((someHandler) => {
            return someHandler !== handler;
        }): [];
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

    stopListening(source: Event): Event {
        this.listenings = this.listenings.filter((listening: Listening) => {
            if (listening.source == source) {
                source.off(listening.handler);
                return false;
            }

            return true;
        });

        return this;
    }

    private handlers: Array<() => void> = [];
    private listenings: Array<Listening> = [];
}

interface Listening {
    source: Event;
    handler: () => void;
}

export = Event;