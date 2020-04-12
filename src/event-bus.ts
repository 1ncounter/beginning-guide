type Listeners = Record<string, Function[]>;

export class EventBus {
  private listeners: Listeners = {};

  on(type: string, callback: Function) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(callback);
  }

  off(type: string, callback: Function) {
    if (!this.listeners[type]) return;

    this.listeners[type] = this.listeners[type].filter(
      listener => listener !== callback
    );
  }

  emit(type: string, ...args: unknown[]) {
    if (!this.listeners[type]) return;

    this.listeners[type].forEach(listener => {
      listener.call(null, ...args);
    });
  }

  clearListeners() {
    this.listeners = {};
  }
}
