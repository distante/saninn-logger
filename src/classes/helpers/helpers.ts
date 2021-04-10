import { LogLevelsEnum } from '../../models/log-levels.enum';
import { LoggerTypesEnum } from '../../models/log-types.enum';
import { RequiredLoggerConfig } from '../../models/type-definitions';

export namespace Helpers {
  export const LOG_TYPES_ARRAY: LoggerTypesEnum[] = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];

  export function getBindedConsoleProxy(
    logType: LoggerTypesEnum,
    consoleProxy: PatchedConsole,
    config: RequiredLoggerConfig
  ): typeof ____patchedConsoleForSaninnLogger___[LoggerTypesEnum] {
    let logTypeToPrint = '';
    if (config.showLoggerFunctionNames && logType !== LoggerTypesEnum.dir) {
      logTypeToPrint = `[${logType.toUpperCase()}]`;
    }

    if (!config.prefix && !config.showLoggerFunctionNames) {
      return consoleProxy[logType].bind(console) as any;
    }

    if (!config.prefix && logTypeToPrint.length && logType !== LoggerTypesEnum.dir) {
      return consoleProxy[logType].bind(console, logTypeToPrint + ':') as any;
    }

    if (!config.prefix) {
      return consoleProxy[logType].bind(console) as any;
    }

    const prefixString = `[${config.prefix}]${logTypeToPrint}:`;

    // Console.dir does not accept multiparameters,
    // We will add a raw console.log before the dir print
    if (logType === LoggerTypesEnum.dir) {
      // tslint:disable-next-line:no-console
      console.log(prefixString + '(dir after this line)');
      return consoleProxy[logType].bind(console) as any;
    }

    if (!config.prefixColors![logType]) {
      return consoleProxy[logType].bind(console, prefixString) as any;
    }

    return consoleProxy[logType].bind(console, `%c${prefixString}`, `color: ${config.prefixColors![logType]}`) as any;
  }

  /**
   * Maps LoggerTypesEnum to LogLevelsEnum values, allowing to set mo
   */
  export function getLogLevelOf(logType: LoggerTypesEnum): LogLevelsEnum {
    switch (logType) {
      case LoggerTypesEnum.debug:
        return LogLevelsEnum.DEBUG;
      case LoggerTypesEnum.dir:
      case LoggerTypesEnum.info:
      case LoggerTypesEnum.log:
        return LogLevelsEnum.INFO;
      case LoggerTypesEnum.warn:
        return LogLevelsEnum.WARN;
      case LoggerTypesEnum.error:
        return LogLevelsEnum.ERROR;
      case LoggerTypesEnum.fatal:
        return LogLevelsEnum.FATAL;
      default:
        throw new Error('this LogType is not mapped to a LogLevel');
    }
  }
}
