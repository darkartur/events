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

    private handlers: Array<() => void> = [];
}

export = Event;