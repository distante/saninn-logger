/*!
 *  @license
 *
 *  Copyright Saninn Salas Diaz All Rights Reserved.
 *
 *  Released under the MIT License
 *
 *  http://www.saninnsalas.com
 */
import { LoggerTypesEnum } from './models/log-types.enum';
import { ILoggerConfig } from './models/logger-config.interface';
import { ILogger } from './models/logger.interface';
import { LoggerProcessor, LoggerTypesObject, RequiredLoggerConfig } from './models/type-definitions';

// let saninnLoggerInstanceCounter = 0;

const LOG_TYPES_ARRAY: LoggerTypesEnum[] = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];
export class SaninnLogger implements ILogger {
  private config: RequiredLoggerConfig = {
    prefix: '',
    prefixColors: {},
    printToConsole: true,
    globalPreLoggerFunctions: {},
    useLoggerProcessors: false,
    loggerProcessors: {}
  };

  private consoleFunctionProxys: LoggerTypesObject<Function> = {};
  private consoleProxyHandler: ProxyHandler<Console> = {
    get: (target: Console, prop: LoggerTypesEnum) => {
      if (this.config.useLoggerProcessors) {
        return this.consoleFunctionProxys[prop];
      } else {
        return target[prop];
      }
    }
  };

  private consoleProxy = new Proxy(console, this.consoleProxyHandler);

  constructor(loggerConfig?: string | ILoggerConfig) {
    // saninnLoggerInstanceCounter++;
    // this.loggerId = `SaninnLogger_${Date.now()}_${saninnLoggerInstanceCounter}`;

    this.initProxy();

    if (!loggerConfig) {
      return;
    }

    if (typeof loggerConfig === 'string') {
      this.config.prefix = loggerConfig;
      return;
    }

    this.config.prefix = loggerConfig.prefix || '';

    this.config.useLoggerProcessors = !!loggerConfig.useLoggerProcessors;

    if (loggerConfig.loggerProcessors) {
      this.initializeLoggerProcessorsWith(loggerConfig.loggerProcessors);
    }

    // Since printToConsole is true by default this is the safest way to assign it.
    if (typeof loggerConfig.printToConsole !== 'undefined') {
      this.config.printToConsole = loggerConfig.printToConsole;
    }

    this.initializeObjectsBasedOnEnumsLogTypes(
      this.config.globalPreLoggerFunctions,
      loggerConfig.globalPreLoggerFunctions
    );

    // IE does not support colors!
    const isIE = this.isIE();
    if (!isIE) {
      this.initializeObjectsBasedOnEnumsLogTypes(this.config.prefixColors, loggerConfig.prefixColors);
    }
  }

  private initializeLoggerProcessorsWith(loggerProcessors: LoggerTypesObject<LoggerProcessor[]>) {
    LOG_TYPES_ARRAY.forEach(logType => {
      if (loggerProcessors[logType]) {
        this.config.loggerProcessors[logType] = loggerProcessors[logType];
      } else {
        this.config.loggerProcessors[logType] = [];
      }
    });
  }

  private initProxy() {
    LOG_TYPES_ARRAY.forEach(logType => {
      const consoleFunctionHandler: ProxyHandler<Function> = {
        // tslint:disable-next-line:object-literal-shorthand
        apply: (target, consoleObject, argumentsList) =>
          this.consoleFunctionProxyApply(target, consoleObject, argumentsList, logType)
      };
      this.consoleFunctionProxys[logType] = new Proxy(console[logType], consoleFunctionHandler);
      // console.error(this.consoleFunctionProxys[logType]);
    });
  }

  /**
   * @private
   * @param {Function} nativeConsoleFunction - The native console.log Function
   * @param {Console} _nativeConsoleObject - window.console / global.console
   * @param {any[]} argumentsList - contains all arguments sended to console.x(), including prefix, color, etc
   * @param {LoggerTypesEnum} logType
   * @returns void
   * @memberof SaninnLogger
   */
  private consoleFunctionProxyApply(
    nativeConsoleFunction: Function,
    _nativeConsoleObject: Console,
    argumentsList: any[],
    logType: LoggerTypesEnum
  ) {
    if (this.config.loggerProcessors[logType]!.length) {
      this.runLoggerProcessorsOf(logType, argumentsList);
    }
    return nativeConsoleFunction(...argumentsList);
  }

  private runLoggerProcessorsOf(logType: LoggerTypesEnum, rawArgumentList: any[]) {
    let initialIndexOfArguments = 0;
    let prefix = this.config.prefix;

    if (logType !== LoggerTypesEnum.dir) {
      if (this.config.prefix) initialIndexOfArguments++;
      if (this.config.prefixColors[logType]) initialIndexOfArguments++;
    }

    const argumentsList = rawArgumentList.slice(initialIndexOfArguments);

    this.config.loggerProcessors[logType]!.forEach(loggerProcessor => {
      loggerProcessor(prefix, argumentsList);
    });
  }

  private getConsoleHandlerFor(logType: LoggerTypesEnum): Function {
    const extraFunctionForThisLogType = this.config.globalPreLoggerFunctions[logType];
    // TODO: add an callback for when this function is done?????
    if (extraFunctionForThisLogType) {
      extraFunctionForThisLogType(this.config.prefix);
    }

    if (!this.config.printToConsole) {
      // tslint:disable-next-line:no-empty
      return () => {};
    }

    if (!this.config.prefix) {
      return this.consoleProxy[logType].bind(console);
    }

    const prefixString = `[${this.config.prefix}]:`;

    // Console.dir does not accept multiparameters,
    // We will add a raw console.log before the dir print
    if (logType === LoggerTypesEnum.dir) {
      // tslint:disable-next-line:no-console
      console.log(prefixString + '(dir after this line)');
      return this.consoleProxy[logType].bind(console);
    }

    if (!this.config.prefixColors[logType]) {
      return this.consoleProxy[logType].bind(console, prefixString);
    }

    return this.consoleProxy[logType].bind(console, `%c${prefixString}`, `color: ${this.config.prefixColors[logType]}`);
  }

  private initializeObjectsBasedOnEnumsLogTypes(
    object: LoggerTypesObject<any>,
    configs: LoggerTypesObject<any> | undefined
  ) {
    if (!configs) {
      return;
    }

    LOG_TYPES_ARRAY.forEach(logType => {
      if (configs[logType]) {
        object[logType] = configs[logType];
      }
    });
  }

  private isIE() {
    // @ts-ignore
    return /*@cc_on!@*/ false || !!document.documentMode;
  }

  //    ██████  ██    ██ ██████  ██      ██  ██████
  //    ██   ██ ██    ██ ██   ██ ██      ██ ██
  //    ██████  ██    ██ ██████  ██      ██ ██
  //    ██      ██    ██ ██   ██ ██      ██ ██
  //    ██       ██████  ██████  ███████ ██  ██████

  public addLoggerProcessor() {
    console.error(this.addLoggerProcessor.name + ' not implemented');
  }

  public removeLoggerProcessor() {
    console.error(this.removeLoggerProcessor.name + ' not implemented');
  }

  public enableLoggerProcessors() {
    console.error(this.addLoggerProcessor.name + ' not implemented');
  }

  public disableLoggerProcessors() {
    console.error(this.removeLoggerProcessor.name + ' not implemented');
  }

  // TODO: There should be a way to make this automatically from the Enum...
  get log(): Function {
    return this.getConsoleHandlerFor(LoggerTypesEnum.log);
  }

  get warn(): Function {
    return this.getConsoleHandlerFor(LoggerTypesEnum.warn);
  }

  /**
   * console.dir does not accept multiparameters
   * if you log `logger.dir(x,y)` `y` will be ignored
   */
  get dir(): Function {
    return this.getConsoleHandlerFor(LoggerTypesEnum.dir);
  }

  get error(): Function {
    return this.getConsoleHandlerFor(LoggerTypesEnum.error);
  }
}
