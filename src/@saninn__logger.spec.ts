import { SaninnLogger } from './@saninn__logger';
import { LoggerTypesEnum } from './models/log-types.enum';

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
  describe('prefixColor should just work the environment is the correct one', () => {
    test('Should not work if global exist', () => {
      const textExpected = 'saninn test';
      spyOn(global, 'process').and.returnValue(false);
      spyOn(window.console, 'log');
      const saninnLogger = new SaninnLogger({
        prefixColors: {
          log: 'red'
        }
      });

      saninnLogger.log(textExpected);

      expect(window.console.log).toHaveBeenCalledWith(textExpected);
    });
  });
});

/**
 * Normally this should be done one at the time, BUT in this way
 * we are able to expand LoggerTypes and we will get an error if
 * a new LogType was not defined
 */
test('Each call to a getter (using LoggerTypesEnum Keys) should return the correspond console function ', () => {
  const consoleFunctionNames = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];
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
