import { SaninnLogger } from './@saninn__logger';
import { LoggerTypesEnum } from './models/log-types.enum';

beforeEach(() => {
  jest.restoreAllMocks();
});

test('It is possible to create a SaninnLogger instance', () => {
  const saninnLogger = new SaninnLogger('test');
  expect(saninnLogger).toBeTruthy();
});

/**
 * Normally this should be done one at the time, BUT in this way
 * we are able to expand LoggerTypes and we will get an error if
 */

test('Each call to a getter (using LoggerTypesEnum Keys) should return the correspond console function ', () => {
  const saninnLogger = new SaninnLogger();
  const consoleFunctionNames = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];
  consoleFunctionNames.forEach((consoleFunction: LoggerTypesEnum) => {
    const expected = () => {
      return;
    };
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(expected);

    const returnedFunction = saninnLogger[consoleFunction];

    expect(returnedFunction).toEqual(expected);
  });
});

test('it calls console.log', () => {
  spyOn(console, 'log');
  const saninnLogger = new SaninnLogger('test');
  saninnLogger.log('test');
  expect(console.log).toHaveBeenCalledTimes(1);
});
