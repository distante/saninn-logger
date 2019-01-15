import { SaninnLogger } from './@saninn__logger';
import { LoggerTypesEnum } from './models/log-types.enum';

/**
 * LoggerTypesEnum constructs the logger interface and several objects.
 * Here it will be also used as pivot for the tests.
 */
const consoleFunctionNames = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('It is possible to create a SaninnLogger instance', () => {
  test('Without parameters', () => {
    const saninnLogger = new SaninnLogger();
    expect(saninnLogger).toBeTruthy();
  });
  test('With just the name as a string parameter', () => {
    const saninnLogger = new SaninnLogger('test');
    expect(saninnLogger).toBeTruthy();
  });
  test('With an empty Object', () => {
    const saninnLogger = new SaninnLogger({});
    expect(saninnLogger).toBeTruthy();
  });
  test('With an config Object', () => {
    const saninnLogger = new SaninnLogger({
      prefix: 'hello',
      printToConsole: false
    });
    expect(saninnLogger).toBeTruthy();
  });
});

/**
 * Normally this should be done one at the time, BUT in this way
 * we are able to expand LoggerTypes and we will get an error if
 * a new LogType was not defined
 */
test('Each call to a getter (using LoggerTypesEnum Keys) should return the correspond console function ', () => {
  const saninnLogger = new SaninnLogger();

  consoleFunctionNames.forEach((consoleFunction: LoggerTypesEnum) => {
    const expected = () => {
      return;
    };
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(expected);

    // tslint:disable-next-line:no-console
    console.log(`calling ${consoleFunction}`);

    const returnedFunction = saninnLogger[consoleFunction];

    expect(returnedFunction).toEqual(expected);
  });
});

describe('prefix', () => {
  const prefixText = 'prefix text';
  const completePrefix = `[${prefixText}]:`;
  let saninnLogger: SaninnLogger;
  beforeEach(() => {
    saninnLogger = new SaninnLogger(prefixText);
  });

  const log: LoggerTypesEnum = LoggerTypesEnum.log;
  test(`should call ${log} function with the given prefix`, () => {
    spyOn(console, log);
    saninnLogger[log]();
    expect(console[log]).toHaveBeenCalledWith(completePrefix);
  });

  const warn: LoggerTypesEnum = LoggerTypesEnum.warn;
  test(`should call ${warn} function with the given prefix`, () => {
    spyOn(console, warn);
    saninnLogger[warn]();
    expect(console[warn]).toHaveBeenCalledWith(completePrefix);
  });

  const error: LoggerTypesEnum = LoggerTypesEnum.error;
  test(`should call ${error} function with the given prefix`, () => {
    spyOn(console, error);
    saninnLogger[error]();
    expect(console[error]).toHaveBeenCalledWith(completePrefix);
  });

  // dir does not have prefix!
  const dir: LoggerTypesEnum = LoggerTypesEnum.dir;
  test(`should NOT call ${dir} function with the given prefix`, () => {
    spyOn(console, dir);
    saninnLogger[dir]();
    expect(console[dir]).not.toHaveBeenCalledWith(completePrefix);
  });
});

describe('prefixColor should just work if the environment is the correct one', () => {
  test('Should not work if we are not in browser', () => {
    const textExpected = 'saninn test';
    const prefixText = 'prefix';
    const fullPrefix = `[${prefixText}]:`;
    spyOn(window.console, 'log');
    const isBrowser = spyOn(SaninnLogger.prototype as any, 'isBrowser').and.returnValue(false);
    const saninnLogger = new SaninnLogger({
      prefix: 'prefix',
      prefixColors: {
        log: 'red'
      }
    });

    saninnLogger.log(textExpected);
    expect(isBrowser).toHaveBeenCalled();
    expect(window.console.log).toHaveBeenCalledWith(fullPrefix, textExpected);
  });
});

describe('log', () => {
  const loggerTypeToTest: LoggerTypesEnum = LoggerTypesEnum.log;

  test('should call the console.log with the prefix', () => {
    const prefixText = 'test';
    const expectedPrefix = `[${prefixText}]:`;
    const saninnLogger = new SaninnLogger(prefixText);
    spyOn(console, 'log');
    saninnLogger[loggerTypeToTest]();
    expect(console[loggerTypeToTest]).toBeCalledWith(expectedPrefix);
  });
});
