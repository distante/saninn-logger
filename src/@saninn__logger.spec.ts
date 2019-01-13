import { SaninnLogger } from './@saninn__logger';

beforeEach(() => {
  jest.restoreAllMocks();
});

test('creates a new SaninnLogger instance', () => {
  const saninnLogger = new SaninnLogger('test');
  expect(saninnLogger).toBeTruthy();
});

test('it calls console.log', () => {
  spyOn(console, 'log');
  const saninnLogger = new SaninnLogger('test');
  saninnLogger.log('test');
  expect(console.log).toHaveBeenCalledTimes(1);
});
