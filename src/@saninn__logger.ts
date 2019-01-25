/*!
 *  @license
 *
 *  Copyright Saninn Salas Diaz All Rights Reserved.
 *
 *  Released under the MIT License
 *
 *  http://www.saninnsalas.com
 */
import { IExtendedConsoleForLogger } from './models/extended-console.interface';
import { LoggerTypesEnum } from './models/log-types.enum';
import { ILoggerConfig } from './models/logger-config.interface';
import { ILogger } from './models/logger.interface';
import { LoggerTypesObject } from './models/type-definitions';

let saninnLoggerInstanceId = 0;

const LOG_TYPES_ARRAY: LoggerTypesEnum[] = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];

export class SaninnLogger implements ILogger {
  private loggerId: string;

  private config: Required<ILoggerConfig> = {
    prefix: '',
    prefixColors: {},
    printToConsole: true,
    preLoggerFunctions: {},
    extraLoggerProcessors: {}
  };

  private extendedConsole: IExtendedConsoleForLogger = console as IExtendedConsoleForLogger;
  private consoleFunctionProxys: LoggerTypesObject<Function> = {};
  private consoleProxyHandler: ProxyHandler<Console> = {
    get: (target: Console, prop: LoggerTypesEnum) => {
      return target[prop];
      // here the option to prop or server
      // return this.consoleFunctionProxys[prop]!.bind(console);
    }
  };
  private consoleProxy = new Proxy(console, this.consoleProxyHandler);

  constructor(loggerConfig?: string | ILoggerConfig) {
    saninnLoggerInstanceId++;
    this.loggerId = `SaninnLogger_${Date.now()}_${saninnLoggerInstanceId}`;

    this.initProxy();

    if (!loggerConfig) {
      return;
    }

    if (typeof loggerConfig === 'string') {
      this.config.prefix = loggerConfig;
      return;
    }

    this.config.prefix = loggerConfig.prefix || '';

    if (typeof loggerConfig.printToConsole !== 'undefined') {
      this.config.printToConsole = loggerConfig.printToConsole;
    }

    this.initializeObjectsBasedOnEnumsLogTypes(this.config.preLoggerFunctions, loggerConfig.preLoggerFunctions);

    this.registerExtraFunctionsInGlobalConsole(loggerConfig.preLoggerFunctions);

    // IE does not support colors!
    const isIE = this.isIE();
    if (!isIE) {
      this.initializeObjectsBasedOnEnumsLogTypes(this.config.prefixColors, loggerConfig.prefixColors);
    }
  }

  private initProxy() {
    const consoleFunctionHandler: ProxyHandler<Function> = {
      // tslint:disable-next-line:object-literal-shorthand
      apply: (target, thisArg, argumentsList) => {
        // tslint:disable-next-line:no-console
        console.log('thisArg', thisArg);
        // tslint:disable-next-line:no-console
        console.log('argumentsList', argumentsList);
        return target(...argumentsList);
      }
    };
    LOG_TYPES_ARRAY.forEach(logType => {
      this.consoleFunctionProxys[logType] = new Proxy(console[logType], consoleFunctionHandler);
    });
  }

  private registerExtraFunctionsInGlobalConsole(preLoggerFunctions: LoggerTypesObject<Function> | undefined) {
    if (!preLoggerFunctions) {
      return;
    }
    if (!this.extendedConsole.___SaninnLogger) {
      this.extendedConsole.___SaninnLogger = {};
    }
    this.extendedConsole.___SaninnLogger[this.loggerId] = {};
    this.initializeObjectsBasedOnEnumsLogTypes(this.extendedConsole.___SaninnLogger[this.loggerId], preLoggerFunctions);
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

  private getConsoleHandlerFor(logType: LoggerTypesEnum): Function {
    const extraFunctionForThisLogType = this.config.preLoggerFunctions[logType];
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
}
