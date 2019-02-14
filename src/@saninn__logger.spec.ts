// tslint:disable-next-line:no-implicit-dependencies
import 'jest-extended';
import { ILoggerConfig } from '../dist';
import { SaninnLogger } from './@saninn__logger';
import { LoggerTypesEnum } from './models/log-types.enum';
import { LoggerTypesObject, LoggerTypesObjectForColors, PreLoggerFunction } from './models/type-definitions';

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

describe('globalPreLoggerFunctions', () => {
  test(`log globalPreLoggerFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.log;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction as PreLoggerFunction;
    const saninnLogger = new SaninnLogger({
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });

  test(`log globalPreLoggerFunction is NOT called when disabled with #disableGlobalLoggerFunctions`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.log;
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger.disableGlobalLoggerFunctions();
    saninnLogger[consoleFunction]();

    expect(mockFunction).not.toHaveBeenCalled();
  });

  test(`log globalPreLoggerFunction IS called when enabled with #enableGlobalLoggerFunctions`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.log;
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger.disableGlobalLoggerFunctions();
    saninnLogger[consoleFunction]();
    saninnLogger.enableGlobalLoggerFunctions();
    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalled();
  });

  test(`log globalPreLoggerFunction is called with the prefix`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.log;
    const loggerPrefix = 'test-logger-prefix';
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      prefix: loggerPrefix,
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledWith(loggerPrefix);
  });

  test(`dir globalPreLoggerFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.dir;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });

  test(`dir globalPreLoggerFunction is called with the prefix`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.dir;
    const loggerPrefix = 'test-logger-prefix';
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      prefix: loggerPrefix,
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledWith(loggerPrefix);
  });

  test(`warn globalPreLoggerFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.warn;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });

  test(`warn globalPreLoggerFunction is called with the prefix`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.warn;
    const loggerPrefix = 'test-logger-prefix';
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      prefix: loggerPrefix,
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledWith(loggerPrefix);
  });

  test(`error globalPreLoggerFunction is called before bind to console`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.error;

    const consoleBindMock = jest.fn();
    spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      consoleBindMock();
    });
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
  });

  test(`error globalPreLoggerFunction is called with the prefix`, () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.error;
    const loggerPrefix = 'test-logger-prefix';
    const mockFunction = jest.fn();
    const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
    loggerFunctionConfigs[consoleFunction] = mockFunction;
    const saninnLogger = new SaninnLogger({
      prefix: loggerPrefix,
      useGlobalPreLoggerFunctions: true,
      globalPreLoggerFunctions: loggerFunctionConfigs
    });

    saninnLogger[consoleFunction]();

    expect(mockFunction).toHaveBeenCalledWith(loggerPrefix);
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
    // tslint:disable-next-line:no-unused-expression
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

describe('showLoggerFunctionNames', () => {
  describe('should print the name of the loggerFunction', () => {
    test('when no prefix is given and no message', () => {
      const logger = new SaninnLogger({
        showLoggerFunctionNames: true
      });

      SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
        if (logType === LoggerTypesEnum.dir) {
          return;
        }
        spyOn(console, logType);
        logger[logType]();
        expect(console[logType]).toHaveBeenCalledWith(`[${logType.toUpperCase()}]:`);
      });
    });

    test('when no prefix is given and a message', () => {
      const logger = new SaninnLogger({
        showLoggerFunctionNames: true
      });

      SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
        const myMessage = 'some message';
        if (logType === LoggerTypesEnum.dir) {
          return;
        }
        spyOn(console, logType);
        logger[logType](myMessage);
        expect(console[logType]).toHaveBeenCalledWith(`[${logType.toUpperCase()}]:`, myMessage);
      });
    });

    test('when a prefix is given', () => {
      const loggerPrefix = 'logger-prefix';
      const logger = new SaninnLogger({
        prefix: loggerPrefix,
        showLoggerFunctionNames: true
      });

      SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
        if (logType === LoggerTypesEnum.dir) {
          return;
        }
        spyOn(console, logType);
        logger[logType]();
        expect(console[logType]).toHaveBeenCalledWith(`[${loggerPrefix}][${logType.toUpperCase()}]:`);
      });
    });

    test('when a prefix and a message is given', () => {
      const loggerPrefix = 'logger-prefix';
      const myMessage = 'some message';
      const logger = new SaninnLogger({
        prefix: loggerPrefix,
        showLoggerFunctionNames: true
      });

      SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
        if (logType === LoggerTypesEnum.dir) {
          return;
        }
        spyOn(console, logType);
        logger[logType](myMessage);
        expect(console[logType]).toHaveBeenCalledWith(`[${loggerPrefix}][${logType.toUpperCase()}]:`, myMessage);
      });
    });
  });

  test('should not print the loggerFunction for .dir without prefix', () => {
    const logger = new SaninnLogger({
      showLoggerFunctionNames: true
    });

    const dirSpy = spyOn(console, 'dir');
    logger.dir();

    const callInfo = dirSpy.calls.mostRecent();
    expect(callInfo.args.length).toBe(0);
  });

  test('should not print the loggerFunction for .dir with prefix', () => {
    const loggerPrefix = 'logger-prefix';
    const logger = new SaninnLogger({
      showLoggerFunctionNames: true,
      prefix: loggerPrefix
    });

    const dirSpy = spyOn(console, 'dir');
    logger.dir();

    const callInfo = dirSpy.calls.mostRecent();
    expect(callInfo.args.length).toBe(0);
  });
});

describe('External logger processors', () => {
  test('useLoggerProcessors should use the console proxy when useLoggerProcessors is true', () => {
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true
    });
    const proxyFunctionSpy = jest.fn();
    // @ts-ignore
    spyOn(saninnLogger.consoleFunctionProxys, 'log').and.callFake(proxyFunctionSpy);

    saninnLogger.log('test');

    expect(proxyFunctionSpy).toHaveBeenCalled();
  });

  test('useLoggerProcessors should use the console proxy when useLoggerProcessors AND printToConsole is false', () => {
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true,
      printToConsole: false
    });
    const proxyFunctionSpy = jest.fn();

    // @ts-ignore
    spyOn(saninnLogger.consoleFunctionProxys, 'log').and.callFake(proxyFunctionSpy);

    saninnLogger.log('test');

    expect(proxyFunctionSpy).toHaveBeenCalled();
  });

  describe('the given loggerProcessor function should be called', () => {
    test('log loggerProcessors', () => {
      const consoleFunction = 'log';
      const extraLogProcessor1 = jest.fn();
      const extraLogProcessor2 = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        prefix: prefixTest,
        useLoggerProcessors: true,
        loggerProcessors: {
          log: [extraLogProcessor1, extraLogProcessor2]
        }
      });

      saninnLogger[consoleFunction](textTest);

      expect(extraLogProcessor1).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor2).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor1).toHaveBeenCalledBefore(extraLogProcessor2);
    });

    test('warn loggerProcessors', () => {
      const consoleFunction = 'warn';
      const extraLogProcessor1 = jest.fn();
      const extraLogProcessor2 = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        prefix: prefixTest,
        useLoggerProcessors: true,
        loggerProcessors: {
          warn: [extraLogProcessor1, extraLogProcessor2]
        }
      });

      saninnLogger[consoleFunction](textTest);

      expect(extraLogProcessor1).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor2).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor1).toHaveBeenCalledBefore(extraLogProcessor2);
    });

    test('error loggerProcessors', () => {
      const consoleFunction = 'error';
      const extraLogProcessor1 = jest.fn();
      const extraLogProcessor2 = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        prefix: prefixTest,
        useLoggerProcessors: true,
        loggerProcessors: {
          error: [extraLogProcessor1, extraLogProcessor2]
        }
      });

      saninnLogger[consoleFunction](textTest);

      expect(extraLogProcessor1).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor2).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor1).toHaveBeenCalledBefore(extraLogProcessor2);
    });

    test('dir loggerProcessors', () => {
      const consoleFunction = 'dir';
      const extraLogProcessor1 = jest.fn();
      const extraLogProcessor2 = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        prefix: prefixTest,
        useLoggerProcessors: true,
        loggerProcessors: {
          dir: [extraLogProcessor1, extraLogProcessor2]
        }
      });

      saninnLogger[consoleFunction](textTest);

      expect(extraLogProcessor1).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor2).toHaveBeenCalledWith(prefixTest, [textTest]);
      expect(extraLogProcessor1).toHaveBeenCalledBefore(extraLogProcessor2);
    });
  });
  describe('the given loggerProcessor function should be called WITHOUT print to console', () => {
    test('log loggerProcessors', () => {
      const consoleFunction = 'log';
      const extraLogProcessor = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        printToConsole: false,
        prefix: prefixTest,
        useLoggerProcessors: true,
        loggerProcessors: {
          log: [extraLogProcessor]
        }
      });

      saninnLogger[consoleFunction](textTest);
      expect(extraLogProcessor).toHaveBeenCalledWith(prefixTest, [textTest]);
    });
  });
  test('excludes the color argument', () => {
    const consoleFunction = 'log';
    const extraLogProcessor = jest.fn();
    const prefixTest = 'prefix-test';
    const textTest = 'some random text';
    const saninnLogger = new SaninnLogger({
      prefix: prefixTest,
      useLoggerProcessors: true,
      prefixColors: {
        log: 'red'
      },
      loggerProcessors: {
        log: [extraLogProcessor]
      }
    });

    saninnLogger[consoleFunction](textTest);

    expect(extraLogProcessor).toHaveBeenCalledWith(prefixTest, [textTest]);
  });

  test('excludes the color argument BUT keeps the prefix', () => {
    const consoleFunction = 'log';
    const extraLogProcessor = jest.fn();
    const prefixTest = 'prefix-test';
    const textTest = 'some random text';
    const saninnLogger = new SaninnLogger({
      prefix: prefixTest,
      useLoggerProcessors: true,
      prefixColors: {
        log: 'red'
      },
      loggerProcessors: {
        log: [extraLogProcessor]
      }
    });

    saninnLogger[consoleFunction](textTest);

    expect(extraLogProcessor).toHaveBeenCalledWith(prefixTest, [textTest]);
  });

  test('if no processor is registered nothing breaks', () => {
    const consoleFunction = 'log';
    const textTest = 'some random text';
    const someRandomObject = { a: 1, b: 2 };
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true
    });
    // @ts-ignore
    const proxyFunctionSpy = spyOn(saninnLogger.consoleFunctionProxys, 'log').and.callThrough();
    // @ts-ignore
    const runLoggerProcessorSpy = spyOn(saninnLogger, 'runLoggerProcessorsOf').and.callThrough();

    saninnLogger[consoleFunction](textTest, someRandomObject);

    expect(runLoggerProcessorSpy).not.toHaveBeenCalled();
    expect(proxyFunctionSpy).toHaveBeenCalledWith(textTest, someRandomObject);
  });
});

describe('Add and remove logger Processors', () => {
  test('A new logger processor is called in the next console call after added with #addLoggerProcessor', () => {
    const createTimeProcessor = jest.fn();
    const runTimeAddedLoggerProcessor = jest.fn();
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true,
      loggerProcessors: {
        log: [createTimeProcessor]
      }
    });

    saninnLogger.log('test');
    saninnLogger.addLoggerProcessor(LoggerTypesEnum.log, runTimeAddedLoggerProcessor);

    saninnLogger.log('test 2');

    expect(createTimeProcessor).toHaveBeenCalledTimes(2);
    expect(runTimeAddedLoggerProcessor).toHaveBeenCalledTimes(1);
  });

  test('I a logger processor to remove with #removeLoggerProcessor does not exist, nothing breaks', () => {
    const createTimeProcessor = jest.fn();
    const runTimeAddedLoggerProcessor = jest.fn();
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true,
      loggerProcessors: {
        log: [createTimeProcessor]
      }
    });

    saninnLogger.removeLoggerProcessor(LoggerTypesEnum.log, runTimeAddedLoggerProcessor);
    saninnLogger.log('just one processor should run');

    expect(createTimeProcessor).toHaveBeenCalledTimes(1);
    expect(runTimeAddedLoggerProcessor).not.toHaveBeenCalled();
  });

  test('A new logger processor is not called after removed with #removeLoggerProcessor', () => {
    const createTimeProcessor = jest.fn();
    const runTimeAddedLoggerProcessor = jest.fn();
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true,
      loggerProcessors: {
        log: [createTimeProcessor]
      }
    });

    saninnLogger.addLoggerProcessor(LoggerTypesEnum.log, runTimeAddedLoggerProcessor);
    saninnLogger.log('two processor should run');

    saninnLogger.removeLoggerProcessor(LoggerTypesEnum.log, runTimeAddedLoggerProcessor);
    saninnLogger.log('just one processor should run');

    expect(createTimeProcessor).toHaveBeenCalledTimes(2);
    expect(runTimeAddedLoggerProcessor).toHaveBeenCalledTimes(1);
  });

  test('#disableLoggerProcessors prevents logger processors to be called', () => {
    const loggerProcessor = jest.fn();
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true,
      loggerProcessors: {
        log: [loggerProcessor]
      }
    });

    saninnLogger.log('run logger processor');
    saninnLogger.disableLoggerProcessors();
    saninnLogger.log('logger processor disabled');

    expect(loggerProcessor).toHaveBeenCalledTimes(1);
  });

  test('#enableLoggerProcessors reactivates calls to logger processors', () => {
    const loggerProcessor = jest.fn();
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true,
      loggerProcessors: {
        log: [loggerProcessor]
      }
    });

    saninnLogger.disableLoggerProcessors();
    saninnLogger.log('logger processor disabled');
    saninnLogger.enableLoggerProcessors();
    saninnLogger.log('logger processor Enabled');

    expect(loggerProcessor).toHaveBeenCalledTimes(1);
  });
});

test('#disablePrintToConsole deactivate console Prints', () => {
  const saninnLogger = new SaninnLogger({
    prefix: 'test'
  });

  const loggerActive = saninnLogger.log;
  saninnLogger.disablePrintToConsole();
  const loggerInactive = saninnLogger.log;

  expect(loggerActive).not.toBe(loggerInactive);
  expect(loggerInactive).toBe((saninnLogger as any).emptyConsoleFunction);
});

test('#enablePrintToConsole activates console Prints', () => {
  const saninnLogger = new SaninnLogger({
    prefix: 'test',
    printToConsole: false
  });

  const loggerInactive = saninnLogger.log;
  saninnLogger.enablePrintToConsole();
  const loggerActive = saninnLogger.log;

  expect(loggerActive).not.toBe(loggerInactive);
  expect(loggerInactive).toBe((saninnLogger as any).emptyConsoleFunction);
});

test('prefix can be changed using #setPrefixTo', () => {
  const initialPrefix = 'initial prefix';
  const finalPrefix = 'final prefix';
  const fullFinalPrefix = `[${finalPrefix}]:`;
  const saninnLogger = new SaninnLogger({
    prefix: initialPrefix
  });

  const consoleSpy = spyOn(console, 'log');

  saninnLogger.setPrefixTo(finalPrefix);
  saninnLogger.log();

  expect(consoleSpy).toHaveBeenCalledWith(fullFinalPrefix);
});

test('can be completely disable', () => {
  const spyFunction = jest.fn();
  SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
    spyOn(console, logType).and.callFake(spyFunction);
  });

  const fullConfig: ILoggerConfig = {
    useGlobalPreLoggerFunctions: true,
    globalPreLoggerFunctions: {
      dir: prefix => {
        spyFunction(prefix);
      },
      error: prefix => {
        spyFunction(prefix);
      },
      log: prefix => {
        spyFunction(prefix);
      },
      warn: prefix => {
        spyFunction(prefix);
      }
    },

    prefix: 'full-config-logger',
    prefixColors: {
      error: 'blue',
      log: 'green',
      warn: 'red'
    },
    printToConsole: false,
    useLoggerProcessors: true,
    loggerProcessors: {
      log: [
        (prefix, args) => {
          spyFunction(prefix, args);
        },
        (prefix, args) => {
          spyFunction(prefix, args);
        }
      ]
    }
  };

  const saninnLogger = new SaninnLogger(fullConfig);

  saninnLogger.disableAll();

  SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
    saninnLogger[logType]('I should not be called!');
  });

  expect(spyFunction).not.toHaveBeenCalled();
});
