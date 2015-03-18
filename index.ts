class Event {

    private message: string = 'Hello world!';

    greet() {
        console.log(this.message);
    }
}

var greeter: Event = new Event();

greeter.greet();