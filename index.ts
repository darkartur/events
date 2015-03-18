class Event {

    on(handler: () => void): Event {
        this.handler = handler;
        return this;
    }

    trigger(): Event {
        this.handler();
        return this;
    }

    private handler: () => void;
}

export = Event;