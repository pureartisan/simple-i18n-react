
export class LinkHanlder {

  constructor() {
    this.reset();
  }

  reset() {
    this.handler = null;
  }

  setHandler(handler) {
    this.handler = handler;
  }

  handle(link) {
    this.handler && this.handler(link);
  }

};
