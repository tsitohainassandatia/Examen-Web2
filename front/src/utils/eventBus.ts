type Listener = () => void;

class EventBus {
  private listeners: Listener[] = [];

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  emit() {
    this.listeners.forEach(fn => fn());
  }
}

export const eventBus = new EventBus();
