import { Store } from '@/store';

describe('store', () => {
  test('add state', () => {
    const store = new Store();
    const state = { selector: 'first state' };

    store.addState(state);
    store.setState(state);

    expect(store.getState().selector).toBe('first state');
  });

  test('delete state', () => {
    const store = new Store();
    store.addState([{ selector: '1' }, { selector: '2' }, { selector: '3' }]);

    store.deleteState({ selector: '3' });
    store.nextState();

    expect(store.getState().selector).toBe('2');

    expect(() => {
      store.deleteState({ selector: '1' });
    }).toThrow(
      'the state is current state, please change current state, then delete it!'
    );
  });

  test('previous and next', () => {
    const store = new Store();

    store.addState([{ selector: '1' }, { selector: '2' }, { selector: '3' }]);
    store.nextState();

    expect(store.getState().selector).toBe(2);

    store.prevState();

    expect(store.getState().selector).toBe(1);
  });
});
