class EventManager {
  constructor() {
    this.events = [];
  }

  publish(name, data) {
    const handlers = this.events[name];
    if(!!handlers === false) return;
    handlers.forEach(handler => {
      handler.call(this, data);
    });
  }

  subscribe(name, handler) {
    let handlers = this.events[name];
    if (!!handlers === false) {
      handlers = this.events[name] = [];
    }
    handlers.push(handler);
  }

  unsubscribe(name, handler) {
    const handlers = this.events[name];
    if(!!handlers === false) return;

    const handlerIndex = handlers.indexOf(handler);
    handlers.splice(handlerIndex);
  }
}

export default EventManager;
