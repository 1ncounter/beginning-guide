import { EventBus } from '@/event-bus';

describe('events-bus', () => {
  const bus = new EventBus();

  test('add event', () => {
    const callback = jest.fn();

    bus.on('event', callback);
    bus.emit('event');

    expect(callback).toHaveBeenCalled();
  });

  test('add event and params', () => {
    const callback = jest.fn();

    bus.on('event', callback);
    bus.emit('event', 'param');

    expect(callback).toHaveBeenCalledWith('param');
  });

  test('emit more one times', () => {
    const callback = jest.fn();

    bus.on('event', callback);
    bus.emit('event');
    bus.emit('event');

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('delete event', () => {
    const callback = jest.fn();

    bus.on('event', callback);
    bus.off('event', callback);
    bus.emit('event');

    expect(callback).not.toHaveBeenCalled();
  });
});
