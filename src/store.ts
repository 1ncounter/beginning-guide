import { Node, bus } from './core';

type State = Node;

function proxyTarget(target: Record<string, any>) {
  const handler = {
    get(target: Record<string, any>, key: string, receiver: object) {
      return Reflect.get(target, key, receiver);
    },
    set(
      target: Record<string, any>,
      key: string,
      value: Record<string, any>,
      receiver: object
    ) {
      const ret = Reflect.set(target, key, value, receiver);

      if (key === 'value') {
        bus.emit(value.selector);
      }

      return ret;
    }
  };

  return new Proxy(target, handler);
}

export class Store {
  private states: State[] = [];
  private state: Record<string, any> = proxyTarget({});
  private index = -1;

  addState(state: State | State[], index?: number) {
    if (Array.isArray(state)) {
      if (state.length > 0) {
        const states = [...new Set(state)];

        this.states = this.states.concat(states);
      }
    } else {
      if (index) {
        this.states.splice(index, 0, state);
      } else {
        this.states.push(state);
      }
    }
  }

  deleteState(state: State) {
    if (state === this.state) {
      throw Error(
        'the state is current state, please change current state, then delete it!'
      );
    }

    this.states = this.states.filter(item => item.selector !== state.selector);
  }

  setState(state: State): void {
    const found = this.states.find(item => state.selector === item.selector);

    if (found) {
      this.state.value = found;
      this.index = this.states.indexOf(found);
    }
  }

  setStateBySelector(node: string) {
    const found = this.states.find(item => node === item.selector);

    if (found) {
      this.state.value = found;
      this.index = this.states.indexOf(found);
    }
  }

  setStateByIndex(index: number) {
    this.state.value = this.states[index];
    this.index = index;
  }

  getState(): State {
    return this.state.value;
  }

  prevState() {
    if (this.index > 0) {
      this.index--;
      this.setState(this.states[this.index]);
    }
  }

  nextState() {
    if (this.index < this.states.length - 1) {
      this.index++;
      this.setState(this.states[this.index]);
    }
  }

  getStateIndex() {
    return this.index;
  }

  getStateNumbers() {
    return this.states.length;
  }

  hasState() {
    return this.states.length > 0;
  }

  isLastState() {
    return this.index === this.states.length - 1;
  }

  clear() {
    this.states = [];
    this.state.value = {};
    this.index = -1;
  }
}
