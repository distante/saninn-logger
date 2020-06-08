// tslint:disable-next-line:no-implicit-dependencies
import 'jest-extended';

import { ILoggerConfig } from '../dist';
import { SaninnLogger } from './@saninn__logger';
import { Helpers } from './classes/helpers/helpers';
import { LoggerConfig } from './classes/logger-config/logger-config';
import { LogLevelsEnum } from './models/log-levels.enum';
import { LoggerTypesEnum } from './models/log-types.enum';
import { ILoggerProcessorFunctionParams } from './models/logger-procesor-function-params.interface';
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
      printToConsole: false,
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
  const loggerFunctions: LoggerTypesEnum[] = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];
  loggerFunctions.forEach((consoleFunction: LoggerTypesEnum) => {
    test(`${consoleFunction} globalPreLoggerFunction is called before bind to console`, () => {
      const consoleBindMock = jest.fn();
      spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
        consoleBindMock();
      });
      const mockFunction = jest.fn();
      const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
      loggerFunctionConfigs[consoleFunction] = mockFunction as PreLoggerFunction;
      const saninnLogger = new SaninnLogger({
        useGlobalPreLoggerFunctions: true,
        globalPreLoggerFunctions: loggerFunctionConfigs,
      });

      saninnLogger[consoleFunction]();

      expect(mockFunction).toHaveBeenCalledTimes(1);
      expect(mockFunction).toHaveBeenCalledBefore(consoleBindMock);
    });

    test(`${consoleFunction} globalPreLoggerFunction is NOT called when disabled with #disableGlobalLoggerFunctions`, () => {
      const mockFunction = jest.fn();
      const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
      loggerFunctionConfigs[consoleFunction] = mockFunction;
      const saninnLogger = new SaninnLogger({
        useGlobalPreLoggerFunctions: true,
        globalPreLoggerFunctions: loggerFunctionConfigs,
      });

      saninnLogger.disableGlobalLoggerFunctions();
      saninnLogger[consoleFunction]();

      expect(mockFunction).not.toHaveBeenCalled();
    });

    test(`${consoleFunction} globalPreLoggerFunction IS called when enabled with #enableGlobalLoggerFunctions`, () => {
      const mockFunction = jest.fn();
      const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
      loggerFunctionConfigs[consoleFunction] = mockFunction;
      const saninnLogger = new SaninnLogger({
        useGlobalPreLoggerFunctions: true,
        globalPreLoggerFunctions: loggerFunctionConfigs,
      });

      saninnLogger.disableGlobalLoggerFunctions();
      saninnLogger[consoleFunction]();
      saninnLogger.enableGlobalLoggerFunctions();
      saninnLogger[consoleFunction]();

      expect(mockFunction).toHaveBeenCalled();
    });

    test(`${consoleFunction} globalPreLoggerFunction is called with the prefix`, () => {
      const loggerPrefix = 'test-logger-prefix';
      const mockFunction = jest.fn();
      const loggerFunctionConfigs: LoggerTypesObject<PreLoggerFunction> = {};
      loggerFunctionConfigs[consoleFunction] = mockFunction;
      const saninnLogger = new SaninnLogger({
        prefix: loggerPrefix,
        useGlobalPreLoggerFunctions: true,
        globalPreLoggerFunctions: loggerFunctionConfigs,
      });

      saninnLogger[consoleFunction]();

      expect(mockFunction).toHaveBeenCalledWith(loggerPrefix);
    });
  });
});

describe('printToConsole', () => {
  test('if printToConsole is set to false, the logger should not be bind', () => {
    const consoleFunction: LoggerTypesEnum = LoggerTypesEnum.log;

    const bindSpy = spyOn(console[consoleFunction] as Function, 'bind').and.returnValue(() => {
      /* */
    });
    const saninnLogger = new SaninnLogger({
      printToConsole: false,
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
    warn: 'blue',
  };
  const styles: LoggerTypesObjectForColors = {
    log: `color: ${colors.log}`,
    error: `color: ${colors.error}`,
    warn: `color: ${colors.warn}`,
  };

  test('should not have any prefixColor value if we are in IE', () => {
    // @ts-ignore
    document.documentMode = true;
    // TODO: Move this to logger-config.spec.ts
    const initSpy = spyOn(LoggerConfig.prototype as any, 'initializeObjectsBasedOnEnumsLogTypes');
    // tslint:disable-next-line:no-unused-expression
    new SaninnLogger({
      prefix: prefixText,
      prefixColors: colors,
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
        prefixColors: colors,
      });

      saninnLogger[consoleFunction](textExpected);

      expect(console[consoleFunction]).toHaveBeenCalledWith(fullColoredPrefix, styles[consoleFunction], textExpected);
    });

    test('for warn', () => {
      const consoleFunction = LoggerTypesEnum.warn;
      spyOn(console, consoleFunction).and.callThrough();
      const saninnLogger = new SaninnLogger({
        prefix: prefixText,
        prefixColors: colors,
      });

      saninnLogger[consoleFunction](textExpected);

      expect(console[consoleFunction]).toHaveBeenCalledWith(fullColoredPrefix, styles[consoleFunction], textExpected);
    });

    test('for error', () => {
      const consoleFunction = LoggerTypesEnum.error;
      spyOn(console, consoleFunction).and.callThrough();
      const saninnLogger = new SaninnLogger({
        prefix: prefixText,
        prefixColors: colors,
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
        showLoggerFunctionNames: true,
      });

      Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
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
        showLoggerFunctionNames: true,
      });

      Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
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
        showLoggerFunctionNames: true,
      });

      Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
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
        showLoggerFunctionNames: true,
      });

      Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
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
      showLoggerFunctionNames: true,
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
      prefix: loggerPrefix,
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
      useLoggerProcessors: true,
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
      printToConsole: false,
    });
    const proxyFunctionSpy = jest.fn();

    // @ts-ignore
    spyOn(saninnLogger.consoleFunctionProxys, 'log').and.callFake(proxyFunctionSpy);

    saninnLogger.log('test');

    expect(proxyFunctionSpy).toHaveBeenCalled();
  });

  describe('the given loggerProcessor function should be called', () => {
    test.each(SaninnLogger.LOG_TYPES_ARRAY)('loggerProcessors for %s order', (consoleFunction) => {
      const extraLogProcessor1 = jest.fn();
      const extraLogProcessor2 = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        prefix: prefixTest,
        useLoggerProcessors: true,
        loggerProcessors: {
          [consoleFunction]: [extraLogProcessor1, extraLogProcessor2],
        },
      });

      saninnLogger[consoleFunction](textTest);

      expect(extraLogProcessor1).toHaveBeenCalledWith(
        expect.objectContaining<ILoggerProcessorFunctionParams>({
          prefix: prefixTest,
          logType: consoleFunction,
          args: [textTest],
        })
      );
      expect(extraLogProcessor2).toHaveBeenCalledWith(
        expect.objectContaining<ILoggerProcessorFunctionParams>({
          prefix: prefixTest,
          logType: consoleFunction,
          args: [textTest],
        })
      );
      expect(extraLogProcessor1).toHaveBeenCalledBefore(extraLogProcessor2);
    });
  });
  test.each(SaninnLogger.LOG_TYPES_ARRAY)(
    'loggerProcessors for %s should be called WITHOUT print to console',
    (consoleFunction) => {
      const extraLogProcessor = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        printToConsole: false,
        prefix: prefixTest,
        useLoggerProcessors: true,
        loggerProcessors: {
          [consoleFunction]: [extraLogProcessor],
        },
      });

      saninnLogger[consoleFunction](textTest);
      expect(extraLogProcessor).toHaveBeenCalledWith(
        expect.objectContaining<ILoggerProcessorFunctionParams>({
          prefix: prefixTest,
          logType: consoleFunction,
          args: [textTest],
        })
      );
    }
  );

  test.each(SaninnLogger.LOG_TYPES_ARRAY)('loggerProcessors for %s excludes color argument', (consoleFunction) => {
    const extraLogProcessor = jest.fn();
    const prefixTest = 'prefix-test';
    const textTest = 'some random text';
    const saninnLogger = new SaninnLogger({
      prefix: prefixTest,
      useLoggerProcessors: true,
      prefixColors: {
        [consoleFunction]: 'red',
      },
      loggerProcessors: {
        [consoleFunction]: [extraLogProcessor],
      },
    });

    saninnLogger[consoleFunction](textTest);

    expect(extraLogProcessor).toHaveBeenCalledWith(
      expect.objectContaining<ILoggerProcessorFunctionParams>({
        prefix: prefixTest,
        logType: consoleFunction,
        args: [textTest],
      })
    );
  });

  test.each(SaninnLogger.LOG_TYPES_ARRAY)(
    'loggerProcessors for %s excludes color argument BUT keeps the prefix',
    (consoleFunction) => {
      const extraLogProcessor = jest.fn();
      const prefixTest = 'prefix-test';
      const textTest = 'some random text';
      const saninnLogger = new SaninnLogger({
        prefix: prefixTest,
        useLoggerProcessors: true,
        prefixColors: {
          [consoleFunction]: 'red',
        },
        loggerProcessors: {
          [consoleFunction]: [extraLogProcessor],
        },
      });

      saninnLogger[consoleFunction](textTest);

      expect(extraLogProcessor).toHaveBeenCalledWith(
        expect.objectContaining<ILoggerProcessorFunctionParams>({
          prefix: prefixTest,
          logType: consoleFunction,
          args: [textTest],
        })
      );
    }
  );

  test('if no processor is registered nothing breaks', () => {
    const consoleFunction = 'log';
    const textTest = 'some random text';
    const someRandomObject = { a: 1, b: 2 };
    const saninnLogger = new SaninnLogger({
      useLoggerProcessors: true,
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
        log: [createTimeProcessor],
      },
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
        log: [createTimeProcessor],
      },
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
        log: [createTimeProcessor],
      },
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
        log: [loggerProcessor],
      },
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
        log: [loggerProcessor],
      },
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
    prefix: 'test',
  });

  const loggerActive = saninnLogger.log;
  saninnLogger.disablePrintToConsole();
  const loggerInactive = saninnLogger.log;

  expect(loggerActive).not.toBe(loggerInactive);
  expect(loggerInactive).toBe(SaninnLogger.__emptyConsoleFunction);
});

test('#enablePrintToConsole activates console Prints', () => {
  const saninnLogger = new SaninnLogger({
    prefix: 'test',
    printToConsole: false,
  });

  const loggerInactive = saninnLogger.log;
  saninnLogger.enablePrintToConsole();
  const loggerActive = saninnLogger.log;

  expect(loggerActive).not.toBe(loggerInactive);
  expect(loggerInactive).toBe(SaninnLogger.__emptyConsoleFunction);
});

test('prefix can be changed using #setPrefixTo', () => {
  const initialPrefix = 'initial prefix';
  const finalPrefix = 'final prefix';
  const fullFinalPrefix = `[${finalPrefix}]:`;
  const saninnLogger = new SaninnLogger({
    prefix: initialPrefix,
  });

  const consoleSpy = spyOn(console, 'log');

  saninnLogger.setPrefixTo(finalPrefix);
  saninnLogger.log();

  expect(consoleSpy).toHaveBeenCalledWith(fullFinalPrefix);
});

describe('#setLogLevelTo', () => {
  const logLevelsKeys = Object.keys(LogLevelsEnum).filter((levelKey) => isNaN(parseInt(levelKey, 10)));
  test.each(logLevelsKeys)('sets the level to the given level param', (levelKey: keyof LogLevelsEnum) => {
    const config = LoggerConfig.createInstance();
    jest.spyOn(LoggerConfig, 'createInstance').mockReturnValue(config);
    const wantedLevel = LogLevelsEnum[levelKey];
    const logger = new SaninnLogger();

    logger.setLogLevelTo(wantedLevel);

    expect(config.logLevel).toBe(wantedLevel);
  });
});

test('can be completely disable', () => {
  const spyFunction = jest.fn();
  const globalPreLoggerFunctions: { [key: string]: (prefix: any) => void } = {};

  Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
    spyOn(console, logType).and.callFake(spyFunction);
    globalPreLoggerFunctions[logType] = (prefix) => {
      spyFunction(prefix);
    };
  });

  const fullConfig: ILoggerConfig = {
    useGlobalPreLoggerFunctions: true,
    globalPreLoggerFunctions,
    prefix: 'full-config-logger',
    prefixColors: {
      error: 'blue',
      log: 'green',
      warn: 'red',
    },
    printToConsole: false,
    useLoggerProcessors: true,
    loggerProcessors: {
      log: [
        (params) => {
          spyFunction(params);
        },
        (params) => {
          spyFunction(params);
        },
      ],
    },
  };

  const saninnLogger = new SaninnLogger(fullConfig);

  saninnLogger.disableAll();

  Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
    saninnLogger[logType]('I should not be called!');
  });

  expect(spyFunction).not.toHaveBeenCalled();
});

describe('LogLevels', () => {
  let getBindedConsoleProxySpy: jest.SpyInstance;

  beforeEach(() => {
    getBindedConsoleProxySpy = jest.spyOn(Helpers, 'getBindedConsoleProxy');
  });

  test.each(consoleFunctionNames)(
    '[%s] if the debug level is set to OFF then no call to getBindedConsoleProxy should be done',
    (consoleFunction: LoggerTypesEnum) => {
      const saninnLogger = new SaninnLogger({ logLevel: LogLevelsEnum.OFF });

      saninnLogger[consoleFunction]('something');

      expect(getBindedConsoleProxySpy).not.toHaveBeenCalled();
    }
  );

  test(`setting a log level of ${LogLevelsEnum[LogLevelsEnum.DEBUG]} should allow all calls`, () => {
    const saninnLogger = new SaninnLogger({ logLevel: LogLevelsEnum.DEBUG });
    const firstParameters: LoggerTypesEnum[] = [];
    consoleFunctionNames.forEach((consoleFunction: LoggerTypesEnum, index: number) => {
      saninnLogger[consoleFunction]('something');
      const callFirstParameter = getBindedConsoleProxySpy.mock.calls[index][0];
      firstParameters.push(callFirstParameter);
    });

    expect(firstParameters).toEqual(consoleFunctionNames);
  });

  test(`setting a log level of ${LogLevelsEnum[LogLevelsEnum.INFO]} should no allow Debug calls`, () => {
    const notAllowedCalls: LoggerTypesEnum[] = [LoggerTypesEnum.debug];
    const allowedCalls = consoleFunctionNames.filter((logType) => !notAllowedCalls.includes(logType));
    const saninnLogger = new SaninnLogger({ logLevel: LogLevelsEnum.INFO });

    consoleFunctionNames.forEach((consoleFunction: LoggerTypesEnum, index: number) => {
      saninnLogger[consoleFunction]('something');
    });

    const calls = getBindedConsoleProxySpy.mock.calls;
    const firstParameters: LoggerTypesEnum[] = calls.map((call) => call[0]);

    expect(firstParameters).toEqual(allowedCalls);
  });

  test(`setting a log level of ${
    LogLevelsEnum[LogLevelsEnum.WARN]
  } should no allow Debug and Info(info,log,dir) level calls`, () => {
    const notAllowedCalls: LoggerTypesEnum[] = [
      LoggerTypesEnum.debug,
      LoggerTypesEnum.info,
      LoggerTypesEnum.log,
      LoggerTypesEnum.dir,
    ];
    const allowedCalls = consoleFunctionNames.filter((logType) => !notAllowedCalls.includes(logType));
    const saninnLogger = new SaninnLogger({ logLevel: LogLevelsEnum.WARN });

    consoleFunctionNames.forEach((consoleFunction: LoggerTypesEnum, index: number) => {
      saninnLogger[consoleFunction]('something');
    });

    const calls = getBindedConsoleProxySpy.mock.calls;
    const firstParameters: LoggerTypesEnum[] = calls.map((call) => call[0]);

    expect(firstParameters).toEqual(allowedCalls);
  });

  test(`setting a log level of ${
    LogLevelsEnum[LogLevelsEnum.ERROR]
  } should no allow Debug, Info(info,log,dir) and Warn level calls`, () => {
    const notAllowedCalls: LoggerTypesEnum[] = [
      LoggerTypesEnum.debug,
      LoggerTypesEnum.info,
      LoggerTypesEnum.log,
      LoggerTypesEnum.dir,
      LoggerTypesEnum.warn,
    ];
    const allowedCalls = consoleFunctionNames.filter((logType) => !notAllowedCalls.includes(logType));
    const saninnLogger = new SaninnLogger({ logLevel: LogLevelsEnum.ERROR });

    consoleFunctionNames.forEach((consoleFunction: LoggerTypesEnum, index: number) => {
      saninnLogger[consoleFunction]('something');
    });

    const calls = getBindedConsoleProxySpy.mock.calls;
    const firstParameters: LoggerTypesEnum[] = calls.map((call) => call[0]);

    expect(firstParameters).toEqual(allowedCalls);
  });

  xtest(`setting a log level of ${
    LogLevelsEnum[LogLevelsEnum.FATAL]
  } should no allow Debug, Info(info,log,dir), Warn and Error level calls`, () => {
    const notAllowedCalls: LoggerTypesEnum[] = [
      LoggerTypesEnum.debug,
      LoggerTypesEnum.info,
      LoggerTypesEnum.log,
      LoggerTypesEnum.dir,
      LoggerTypesEnum.warn,
      LoggerTypesEnum.error,
    ];
    const allowedCalls = consoleFunctionNames.filter((logType) => !notAllowedCalls.includes(logType));
    const saninnLogger = new SaninnLogger({ logLevel: LogLevelsEnum.FATAL });

    consoleFunctionNames.forEach((consoleFunction: LoggerTypesEnum, index: number) => {
      saninnLogger[consoleFunction]('something');
    });

    const calls = getBindedConsoleProxySpy.mock.calls;
    const firstParameters: LoggerTypesEnum[] = calls.map((call) => call[0]);

    expect(firstParameters).toEqual(allowedCalls);
  });
});
