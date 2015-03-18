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

    off(): Event {
        this.handlers = [];
        return this;
    }

    listenTo(source: Event, handler: () => void): Event {
        source.on(handler);
        return this;
    }

    stopListening(source: Event): Event {
        source.off();
        return this;
    }

    private handlers: Array<() => void> = [];
}

export = Event;