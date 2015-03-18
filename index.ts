class Event<TParam> {

    add<TChildParam>(): Event<TChildParam> {
        var child: Event<TChildParam> = new Event<TChildParam>();
        this.children.push(child);
        child.parent = this;
        return child;
    }

    on(handler: Callback<TParam>): Event<TParam> {
        this.addHandler(handler);
        return this;
    }

    once(handler: Callback<TParam>): Event<TParam> {
        this.addHandler(handler, true);
        return this;
    }

    trigger(): Event<TParam> {
        this.handlers.forEach((handler: Handler<TParam>) => {
            handler.callback(null);
            if (handler.once) {
                this.off(handler.callback)
            }
        });

        if (this.parent) {
            this.parent.trigger();
        }

        return this;
    }

    off(handler?: Callback<TParam>): Event<TParam> {
        this.handlers = this.handlers.filter((someHandler: Handler<TParam>) => {
            var listener: Event<TParam> = someHandler.listener;

            if (isSameOrFalsy(someHandler.callback, handler)) {
                if (listener) {
                    listener.removeListening(this, someHandler.callback)
                }

                return false;
            }

            return true;
        });

        this.children.forEach((child: Event<TParam>) => {
            child.off();
        });

        return this;
    }

    listenTo<TSourceParam>(source: Event<TSourceParam>, handler: Callback<TSourceParam>): Event<TParam> {
        source.addHandler(handler, false, this);
        this.listenings.push({
            source: source,
            handler: handler
        });
        return this;
    }

    listenToOnce<TSourceParam>(source: Event<TSourceParam>, handler: Callback<TSourceParam>): Event<TParam> {
        source.addHandler(handler, true, this);
        this.listenings.push({
            source: source,
            handler: handler
        });
        return this;
    }

    stopListening<TSourceParam>(source?: Event<TSourceParam>, handler?: Callback<TSourceParam>): Event<TParam> {
        this.listenings.forEach((listening: Listening<TSourceParam>) => {
            if (isSameOrFalsy(listening.source, source) && isSameOrFalsy(listening.handler, handler)) {
                listening.source.off(listening.handler);
                return false;
            }

            return true;
        });

        return this;
    }

    private addHandler(callback: Callback<TParam>, once: boolean = false, listener?: AnyEvent) {
        this.handlers.push({
            callback: callback,
            once: once,
            listener: listener
        });
    }

    private removeListening<TSourceParam>(source: Event<TSourceParam>, handler: Callback<TSourceParam>) {
        this.listenings.filter((listening: Listening<TSourceParam>) => {
            return listening.handler != handler || listening.source != source;
        });
    }

    private parent: AnyEvent;
    private children: AnyEvent[] = [];
    private handlers: Array<Handler<TParam>> = [];
    private listenings: Array<Listening<any>> = [];
}

interface Listening<TParam> {
    source: Event<TParam>;
    handler: Callback<TParam>;
}

interface Handler<TParam> {
    callback: Callback<TParam>;
    once: boolean;
    listener: Event<any>;
}

interface Callback<TParam> {
    (param: TParam): void;
}

class AnyEvent extends Event<any> {}

function isSameOrFalsy(staff, same_or_falsy) {
    return !same_or_falsy || staff == same_or_falsy;
}

export = Event;