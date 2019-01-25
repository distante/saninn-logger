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
import { LoggerTypesObject, LoggerTypesObjectForColors } from './models/type-definitions';

let saninnLoggerInstanceId = 0;

const consoleProxyHandler: ProxyHandler<Console> = {
  get: function get(target: Console, prop: keyof Console) {
    if (prop === 'log') {
      return consoleLogProxy.bind(target);
    }
    return target[prop];
  }
};
const consoleProxy = new Proxy(console, consoleProxyHandler);

const consoleLogProxyHandler: ProxyHandler<Function> = {
  // tslint:disable-next-line:object-literal-shorthand
  apply: (target, thisArg, argumentsList) => {
    // tslint:disable-next-line:no-console
    console.log('thisArg', thisArg);
    // tslint:disable-next-line:no-console
    console.log('argumentsList', argumentsList);
    return target(...argumentsList);
  }
};
const consoleLogProxy = new Proxy(console.log, consoleLogProxyHandler);

console.warn('consoleProxy', consoleLogProxy);

export class SaninnLogger implements ILogger {
  private loggerId: string;
  private prefix?: string;
  private prefixColors: LoggerTypesObjectForColors = {};
  private extraLoggerFunctions: LoggerTypesObject<Function> = {};
  private printToConsole = true;
  private extendedConsole: IExtendedConsoleForLogger = console as IExtendedConsoleForLogger;

  constructor(loggerConfig?: string | ILoggerConfig) {
    saninnLoggerInstanceId++;
    this.loggerId = `SaninnLogger_${Date.now()}_${saninnLoggerInstanceId}`;
    if (!loggerConfig) {
      return;
    }

    if (typeof loggerConfig === 'string') {
      this.prefix = loggerConfig;
      return;
    }

    this.prefix = loggerConfig.prefix;

    if (typeof loggerConfig.printToConsole !== 'undefined') {
      this.printToConsole = loggerConfig.printToConsole;
    }

    this.initializeObjectsBasedOnEnumsLogTypes(this.extraLoggerFunctions, loggerConfig.extraLoggerFunctions);

    this.registerExtraFunctionsInGlobalConsole(loggerConfig.extraLoggerFunctions);

    // IE does not support colors!
    const isIE = this.isIE();
    if (!isIE) {
      this.initializeObjectsBasedOnEnumsLogTypes(this.prefixColors, loggerConfig.prefixColors);
    }
  }

  private registerExtraFunctionsInGlobalConsole(extraLoggerFunctions: LoggerTypesObject<Function> | undefined) {
    if (!extraLoggerFunctions) {
      return;
    }
    if (!this.extendedConsole.___SaninnLogger) {
      this.extendedConsole.___SaninnLogger = {};
    }
    this.extendedConsole.___SaninnLogger[this.loggerId] = {};
    this.initializeObjectsBasedOnEnumsLogTypes(
      this.extendedConsole.___SaninnLogger[this.loggerId],
      extraLoggerFunctions
    );
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
    const extraFunctionForThisLogType = this.extraLoggerFunctions[logType];
    // TODO: add an callback for when this function is done?????
    if (extraFunctionForThisLogType) {
      extraFunctionForThisLogType(this.prefix);
    }

    if (!this.printToConsole) {
      // tslint:disable-next-line:no-empty
      return () => {};
    }

    if (!this.prefix) {
      return consoleProxy[logType].bind(console);
    }

    const prefixString = `[${this.prefix}]:`;

    // Console.dir does not accept multiparameters,
    // We will add a raw console.log before the dir print
    if (logType === LoggerTypesEnum.dir) {
      // tslint:disable-next-line:no-console
      console.log(prefixString + '(dir after this line)');
      return consoleProxy[logType].bind(console);
    }

    if (!this.prefixColors[logType]) {
      return consoleProxy[logType].bind(console, prefixString);
    }

    return consoleProxy[logType].bind(console, `%c${prefixString}`, `color: ${this.prefixColors[logType]}`);
  }
  // @ts-ignore
  private getConsoleHandlerForWithMessage(logType: LoggerTypesEnum, args: IArguments): Function {
    const extraFunctionForThisLogType = this.extraLoggerFunctions[logType];
    // TODO: add an callback for when this function is done?????
    if (extraFunctionForThisLogType) {
      extraFunctionForThisLogType(this.prefix);
    }

    if (!this.printToConsole) {
      // tslint:disable-next-line:no-empty
      return () => {};
    }

    if (!this.prefix) {
      return console[logType].bind(console, args);
    }

    const prefixString = `[${this.prefix}]:`;

    // Console.dir does not accept multiparameters,
    // We will add a raw console.log before the dir print
    if (logType === LoggerTypesEnum.dir) {
      // tslint:disable-next-line:no-console
      console.log(prefixString + '(dir after this line)');
      return console[logType].bind(console, args);
    }

    if (!this.prefixColors[logType]) {
      return console[logType].bind(console, prefixString, args);
    }

    return console[logType].bind(console, `%c${prefixString}`, `color: ${this.prefixColors[logType]}`, args);
  }
  private initializeObjectsBasedOnEnumsLogTypes(
    object: LoggerTypesObject<any>,
    configs: LoggerTypesObject<any> | undefined
  ) {
    if (!configs) {
      return;
    }

    const logTypesArray: LoggerTypesEnum[] = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];

    logTypesArray.forEach(logType => {
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
