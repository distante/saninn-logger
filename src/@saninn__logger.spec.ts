import 'jest-extended';
import { SaninnLogger } from './@saninn__logger';
import { LoggerTypesEnum } from './models/log-types.enum';
import { LoggerTypesObject, LoggerTypesObjectForColors } from './models/type-definitions';

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

describe('extraGlobalLoggerFunctions', () => {
  test(`log extraGlobalFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.log;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs = {} as LoggerTypesObject<Function>;
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      extraLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });

  test(`dir extraGlobalFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.dir;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs = {} as LoggerTypesObject<Function>;
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      extraLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });

  test(`warn extraGlobalFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.warn;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs = {} as LoggerTypesObject<Function>;
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      extraLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });

  test(`error extraGlobalFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.error;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs = {} as LoggerTypesObject<Function>;
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      extraLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });
});

describe('printToConsole', () => {
  test('if printToConsole is set to false, the logger should not be bind', () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.log;

    const bindSpy = spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      /* */
    });
    const saninnLogger = new SaninnLogger({
      printToConsole: false
    });

    saninnLogger[consoleFunction]();

    expect(bindSpy).not.toHaveBeenCalled();
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

describe('prefixColor', () => {
  const textExpected = 'saninn test';
  const prefixText = 'prefix';
  const fullColoredPrefix = `%c[${prefixText}]:`;
  const colors: LoggerTypesObjectForColors = {
    log: 'red',
    error: 'yellow',
    warn: 'blue'
  };
  const styles: LoggerTypesObjectForColors = {
    log: `color: ${colors.log}`,
    error: `color: ${colors.error}`,
    warn: `color: ${colors.warn}`
  };

  test('should not have any prefixColor value if we are in IE', () => {
    // @ts-ignore
    document.documentMode = true;
    const initSpy = spyOn(SaninnLogger.prototype as any, 'initializeObjectsBasedOnEnumsLogTypes');
    // tslint:disable-next-line:no-unused-new
    new SaninnLogger({
      prefix: prefixText,
      prefixColors: colors
    });

    expect(initSpy).toHaveBeenCalledTimes(1);
    // @ts-ignore
    document.documentMode = false;
  });

  describe('should return the colored prefix', () => {
    test('for log', () => {
      const consoleFunction = LoggerTypesEnum.log;
      spyOn(console, consoleFunction).and.callThrough();
      const saninnLogger = new SaninnLogger({
        prefix: prefixText,
        prefixColors: colors
      });

      saninnLogger[consoleFunction](textExpected);

      expect(console[consoleFunction]).toHaveBeenCalledWith(fullColoredPrefix, styles[consoleFunction], textExpected);
    });

    test('for warn', () => {
      const consoleFunction = LoggerTypesEnum.warn;
      spyOn(console, consoleFunction).and.callThrough();
      const saninnLogger = new SaninnLogger({
        prefix: prefixText,
        prefixColors: colors
      });

      saninnLogger[consoleFunction](textExpected);

      expect(console[consoleFunction]).toHaveBeenCalledWith(fullColoredPrefix, styles[consoleFunction], textExpected);
    });

    test('for error', () => {
      const consoleFunction = LoggerTypesEnum.error;
      spyOn(console, consoleFunction).and.callThrough();
      const saninnLogger = new SaninnLogger({
        prefix: prefixText,
        prefixColors: colors
      });

      saninnLogger[consoleFunction](textExpected);

      expect(console[consoleFunction]).toHaveBeenCalledWith(fullColoredPrefix, styles[consoleFunction], textExpected);
    });
  });
});
