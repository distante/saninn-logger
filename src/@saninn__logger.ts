/*!
 *  @license
 *
 *  Copyright Saninn Salas Diaz All Rights Reserved.
 *
 *  Released under the MIT License
 *
 *  http://www.saninnsalas.com
 */
import { Helpers } from './classes/helpers/helpers';
import { LoggerConfig } from './classes/logger-config/logger-config';
import { LogLevelsEnum } from './models/log-levels.enum';
import { LoggerTypesEnum } from './models/log-types.enum';
import { ILoggerConfig } from './models/logger-config.interface';
import { ILogger } from './models/logger.interface';
import { LoggerProcessor, LoggerTypesObject } from './models/type-definitions';
import { ILoggerProcessorFunctionParams } from './models/logger-procesor-function-params.interface';

// let saninnLoggerInstanceCounter = 0;

export class SaninnLogger implements ILogger {
  public static LOG_TYPES_ARRAY = Helpers.LOG_TYPES_ARRAY;

  //    ██████  ███████ ████████ ████████ ███████ ██████  ███████
  //   ██       ██         ██       ██    ██      ██   ██ ██
  //   ██   ███ █████      ██       ██    █████   ██████  ███████
  //   ██    ██ ██         ██       ██    ██      ██   ██      ██
  //    ██████  ███████    ██       ██    ███████ ██   ██ ███████

  // TODO: There should be a way to make this automatically from the Enum...
  // TODO: Or could I use Proxy here???

  get debug(): typeof console.debug {
    return this.getConsoleHandlerFor(LoggerTypesEnum.debug);
  }

  get info(): typeof console.info {
    return this.getConsoleHandlerFor(LoggerTypesEnum.info);
  }

  get log(): typeof console.log {
    return this.getConsoleHandlerFor(LoggerTypesEnum.log);
  }

  /**
   * console.dir does not accept multiparameters
   * if you log `logger.dir(x,y)` `y` will be ignored
   */
  get dir(): typeof console.dir {
    return this.getConsoleHandlerFor(LoggerTypesEnum.dir);
  }

  get warn(): typeof console.warn {
    return this.getConsoleHandlerFor(LoggerTypesEnum.warn);
  }

  get error(): typeof console.error {
    return this.getConsoleHandlerFor(LoggerTypesEnum.error);
  }

  // tslint:disable-next-line: variable-name
  public static readonly __emptyConsoleFunction = () => void 0;

  //    ██████  ██████  ██ ██    ██  █████  ████████ ███████
  //    ██   ██ ██   ██ ██ ██    ██ ██   ██    ██    ██
  //    ██████  ██████  ██ ██    ██ ███████    ██    █████
  //    ██      ██   ██ ██  ██  ██  ██   ██    ██    ██
  //    ██      ██   ██ ██   ████   ██   ██    ██    ███████

  /**
   * This function will be retorned as console[log|warn|dir,etc] handle when
   * the output is disabled with {@link SaninnSalas#config.printToConsole} = false
   *
   */

  private readonly config: LoggerConfig;

  // tslint:disable-next-line:no-empty
  private readonly consoleFunctionProxys: LoggerTypesObject<Function> = {};
  private readonly consoleProxyHandler: ProxyHandler<Console> = {
    get: (target: Console, prop: LoggerTypesEnum) => {
      if (this.config.useLoggerProcessors) {
        return this.consoleFunctionProxys[prop];
      } else {
        return target[prop];
      }
    },
  };

  private readonly consoleProxy = new Proxy<Console>(console, this.consoleProxyHandler);

  constructor(loggerConfig?: string | ILoggerConfig) {
    // saninnLoggerInstanceCounter++;
    // this.loggerId = `SaninnLogger_${Date.now()}_${saninnLoggerInstanceCounter}`;

    this.initProxy();

    if (typeof loggerConfig === 'string') {
      loggerConfig = {
        prefix: loggerConfig,
      };
    }

    this.config = LoggerConfig.createInstance(loggerConfig);
  }

  //    ██████  ██    ██ ██████  ██      ██  ██████
  //    ██   ██ ██    ██ ██   ██ ██      ██ ██
  //    ██████  ██    ██ ██████  ██      ██ ██
  //    ██      ██    ██ ██   ██ ██      ██ ██
  //    ██       ██████  ██████  ███████ ██  ██████

  public setPrefixTo(newPrefix: string) {
    this.config.prefix = newPrefix;
  }

  public disableAll() {
    this.disablePrintToConsole();
    this.disableLoggerProcessors();
    this.disableGlobalLoggerFunctions();
  }

  public enablePrintToConsole() {
    this.config.printToConsole = true;
  }

  public disablePrintToConsole() {
    this.config.printToConsole = false;
  }

  public addLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor) {
    this.config.loggerProcessors![logType]!.push(loggerProcessor);
  }

  public removeLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor) {
    const indexToRemove = this.config.loggerProcessors![logType]!.indexOf(loggerProcessor);
    if (indexToRemove !== -1) {
      this.config.loggerProcessors![logType]!.splice(indexToRemove, 1);
    }
  }

  public enableLoggerProcessors() {
    this.config.useLoggerProcessors = true;
  }

  public disableLoggerProcessors() {
    this.config.useLoggerProcessors = false;
  }

  public enableGlobalLoggerFunctions() {
    this.config.useGlobalPreLoggerFunctions = true;
  }

  public disableGlobalLoggerFunctions() {
    this.config.useGlobalPreLoggerFunctions = false;
  }

  public setLogLevelTo(level: LogLevelsEnum) {
    this.config.logLevel = level;
  }

  private initProxy() {
    Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
      const consoleFunctionHandler: ProxyHandler<Function> = {
        // tslint:disable-next-line:object-literal-shorthand
        apply: (target, consoleObject, argumentsList) =>
          this.consoleFunctionProxyApply(target, consoleObject, argumentsList, logType),
      };
      this.consoleFunctionProxys[logType] = new Proxy(console[logType], consoleFunctionHandler);
      // console.error(this.consoleFunctionProxys[logType]);
    });
  }

  /**
   * @param nativeConsoleFunction - The native console.log Function
   * @param _nativeConsoleObject - window.console / global.console
   * @param argumentsList - contains all arguments sended to console.x(), including prefix, color, etc
   * @returns void
   */
  private consoleFunctionProxyApply(
    nativeConsoleFunction: Function,
    // tslint:disable-next-line:variable-name
    _nativeConsoleObject: Console,
    argumentsList: any[],
    logType: LoggerTypesEnum
  ) {
    if (this.config.loggerProcessors![logType] && this.config.loggerProcessors![logType]!.length) {
      this.runLoggerProcessorsOf(logType, argumentsList);
    }
    if (this.config.printToConsole) {
      // Needed for IE10 https://stackoverflow.com/a/5539378/1255819
      const bindedFunction = Function.prototype.bind.call(nativeConsoleFunction, console);
      return bindedFunction.apply(void 0, argumentsList);
    }
  }

  private runLoggerProcessorsOf(logType: LoggerTypesEnum, rawArgumentList: any[]) {
    let initialIndexOfArguments = 0;
    const prefix = this.config.prefix;

    if (logType !== LoggerTypesEnum.dir && this.config.prefix) {
      initialIndexOfArguments++;
      if (this.config.prefixColors![logType]) {
        initialIndexOfArguments++;
      }
    }

    const argumentsList = rawArgumentList.slice(initialIndexOfArguments);

    // TODO: Use it with the observer pattern?
    this.config.loggerProcessors![logType]!.forEach((loggerProcessor) => {
      const params: ILoggerProcessorFunctionParams = {
        prefix,
        logType,
        args: argumentsList,
      };
      loggerProcessor(params);
    });
  }

  private getConsoleHandlerFor(logType: LoggerTypesEnum): typeof console[LoggerTypesEnum] {
    const extraFunctionForThisLogType = this.config.globalPreLoggerFunctions![logType];

    // TODO: add an callback for when this function is done?????
    if (this.config.useGlobalPreLoggerFunctions && extraFunctionForThisLogType) {
      extraFunctionForThisLogType(this.config.prefix!);
    }

    /** printToConsole is @deprecated */
    const loggerConsoleOutputIsDisabled = !this.config.printToConsole || this.config.logLevel === LogLevelsEnum.OFF;

    if (loggerConsoleOutputIsDisabled && !this.config.useLoggerProcessors) {
      return SaninnLogger.__emptyConsoleFunction as any;
    }

    const logLevelForThisLogType = Helpers.getLogLevelOf(logType);

    if (logLevelForThisLogType < this.config.logLevel) {
      return SaninnLogger.__emptyConsoleFunction as any;
    }

    return Helpers.getBindedConsoleProxy(logType, this.consoleProxy, this.config);
  }
}
