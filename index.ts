module Howl {

    interface IListen<TParam> {
        listen(handler: Callback<TParam>): IListen<TParam>;
        once(handler: Callback<TParam>): IListen<TParam>;
    }

    class EventEngine<TParam> implements IListen<TParam> {

        listen(callback: Callback<TParam>): EventEngine<TParam> {
            this.handlers.push({
                callback: callback,
                once: false
            });
            return this;
        }

        once(callback: Callback<TParam>): EventEngine<TParam> {
            this.handlers.push({
                callback: callback,
                once: true
            });
            return this;
        }

        off(callback?: Callback<TParam>): EventEngine<TParam> {
            this.handlers = this.handlers.filter((handler: Handler<TParam>) => {
                return !isSameOrFalsy(handler.callback, callback);
            });
            return this;
        }

        protected executeHandlers(param?: TParam) {
            this.handlers.forEach((handler: Handler<TParam>) => {
                handler.callback(param);
                if (handler.once) {
                    this.off(handler.callback)
                }
            });
        }

        protected static executeHandlersOn<TParam>(target: EventEngine<TParam>, param?: TParam) {
            target.executeHandlers(param);
        }

        private handlers: Array<Handler<TParam>> = [];
    }

    export class Event<TParam> extends EventEngine<TParam> implements IListen<TParam> {

        add<TChildParam>(child_param?: TParam): Event<TChildParam> {
            var child: Event<TChildParam> = new Event<TChildParam>();
            this.children.push(child);
            child.parent = this;
            child.parent_param = child_param;
            return child;
        }

        trigger(param?: TParam): Event<TParam> {
            this.executeHandlers(param);

            if (this.parent) {
                this.parent.trigger(this.parent_param);
            }

            this.listenings.forEach((listening: Listening<TParam>) => {
                if (listening.source === this) {
                    EventEngine.executeHandlersOn(listening.proxy, param);
                }
            });

            return this;
        }

        off(handler?: Callback<TParam>): Event<TParam> {
            super.off(handler);

            this.children.forEach((child: Event<TParam>) => {
                child.off(handler);
            });

            return this;
        }

        toward(listener: Event<any>): IListen<TParam> {
            var listening: Listening<TParam>;

            listening = find<TParam>(this.listenings, (listening: Listening<TParam>) => {
                return listening.listener == listener;
            });

            if (!listening) {
                listening = {
                    listener: listener,
                    source: this,
                    proxy: new EventEngine<TParam>()
                };

                this.listenings.push(listening);
                listener.listenings.push(listening);
            }

            return listening.proxy;
        }

        stopListening(source?: Event<any>, callback?: Callback<any>): Event<TParam> {
            var sources: Event<any>[] = [];

            this.listenings = this.listenings.filter((listening) => {
                if (isSameOrFalsy(listening.source, source)) {
                    listening.proxy.off(callback);
                    if (!callback) {
                        sources.push(listening.source);
                        return false;
                    }
                }
                return true;
            });

            sources.forEach((source) => {
                source.listenings = source.listenings.filter((listening) => {
                    return listening.listener !== this;
                })
            });

            if (source) {
                source.children.forEach((child) => {
                    this.stopListening(child, callback);
                });
            }

            this.children.forEach((child) => {
                child.stopListening(source, callback);
            });

            return this;
        }

        private parent: Event<any>;
        private parent_param: any;
        private children: Event<any>[] = [];
        private listenings: Listening<TParam>[] = [];
    }


    interface Listening<TParam> {
        listener: Event<any>;
        source: Event<TParam>;
        proxy: EventEngine<TParam>;
    }


    interface Handler<TParam> {
        callback: Callback<TParam>;
        once: boolean;
    }

    interface Callback<TParam> {
        (param: TParam): void;
    }

    function isSameOrFalsy(staff, same_or_falsy) {
        return !same_or_falsy || staff == same_or_falsy;
    }

    function find<TParam>(listenings: Listening<TParam>[], predicate: (item: Listening<TParam>) => {}) {
        var i: number,
            f: Listening<TParam>,
            c: Listening<TParam>;

        for (i = 0; !f && i < listenings.length; i++) {
            c = listenings[i];
            if (predicate(c)) {
                return f = c;
            }
        }

        return f;
    }

}
