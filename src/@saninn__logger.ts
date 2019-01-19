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
import { LoggerTypesObject, LoggerTypesObjectForColors } from './models/type-definitions';

export class SaninnLogger implements ILogger {
  private prefix?: string;
  private prefixColors: LoggerTypesObjectForColors = {};
  private extraGlobalLoggerFunctions: LoggerTypesObject<Function> = {};
  private printToConsole = true;

  constructor(loggerConfig?: string | ILoggerConfig) {
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

    this.initializeObjectsBasedOnEnumsLogTypes(this.extraGlobalLoggerFunctions, loggerConfig.extraLoggerFunctions);

    // IE does not support colors!
    const isIE = this.isIE();
    if (!isIE) {
      this.initializeObjectsBasedOnEnumsLogTypes(this.prefixColors, loggerConfig.prefixColors);
    }
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
    const extraFunctionForThisLogType = this.extraGlobalLoggerFunctions[logType];
    // TODO: add an callback for when this function is done?????
    // TODO: add an extraFunction that works just in a single call? example logger.log(someSingleExtraFunction, "message 1", "message 2")
    // TODO: add there the prefix in case they want to use it.
    if (extraFunctionForThisLogType) {
      extraFunctionForThisLogType();
    }

    if (!this.printToConsole) {
      // tslint:disable-next-line:no-empty
      return () => {};
    }

    if (!this.prefix) {
      return console[logType].bind(console);
    }

    const prefixString = `[${this.prefix}]:`;

    // Console.dir does not accept multiparameters,
    // We will add a raw console.log after this print
    if (logType === LoggerTypesEnum.dir) {
      // tslint:disable-next-line:no-console
      console.log(prefixString + '(dir after this line)');
      return console[logType].bind(console);
    }

    if (!this.prefixColors[logType]) {
      return console[logType].bind(console, prefixString);
    }

    return console[logType].bind(console, `%c${prefixString}`, `color: ${this.prefixColors[logType]}`);
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

  // TODO: Make this better
  private isIE() {
    // @ts-ignore
    return /*@cc_on!@*/ false || !!document.documentMode;
  }
}
