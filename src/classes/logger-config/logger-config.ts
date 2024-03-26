import { LogLevelsEnum } from '../../models/log-levels.enum';
import { ILoggerConfig } from '../../models/logger-config.interface';
import {
  LoggerProcessor,
  LoggerTypesObject,
  LoggerTypesObjectForColors,
  PreLoggerFunction,
  RequiredLoggerConfig,
} from '../../type-definitions';
import { Helpers } from '../helpers/helpers';

export class LoggerConfig implements RequiredLoggerConfig {
  public static createInstance(wantedLoggerConfig?: ILoggerConfig): LoggerConfig {
    return new LoggerConfig(wantedLoggerConfig);
  }

  public prefix = '';

  public prefixColors: LoggerTypesObjectForColors = {};

  public useGlobalPreLoggerFunctions = false;
  public globalPreLoggerFunctions: LoggerTypesObject<PreLoggerFunction> = {};
  public useLoggerProcessors = false;
  // TODO: Make this more type safe (init with the function return instead of mutation)
  public loggerProcessors = ({} as unknown) as LoggerTypesObject<LoggerProcessor[]>;
  public showLoggerFunctionNames = false;
  public logLevel = LogLevelsEnum.DEBUG;

  private constructor(wantedLoggerConfig?: ILoggerConfig) {
    if (!wantedLoggerConfig) {
      return;
    }

    this.prefix = wantedLoggerConfig.prefix || '';

    this.logLevel = wantedLoggerConfig.logLevel || this.logLevel;

    this.useLoggerProcessors = !!wantedLoggerConfig.useLoggerProcessors;

    this.showLoggerFunctionNames = !!wantedLoggerConfig.showLoggerFunctionNames;

    if (wantedLoggerConfig.loggerProcessors) {
      this.initializeLoggerProcessorsWith(wantedLoggerConfig.loggerProcessors);
    }

    this.useGlobalPreLoggerFunctions = !!wantedLoggerConfig.useGlobalPreLoggerFunctions;

    if (this.globalPreLoggerFunctions) {
      this.initializeObjectsBasedOnEnumsLogTypes(
        this.globalPreLoggerFunctions,
        wantedLoggerConfig.globalPreLoggerFunctions
      );
    }

    // IE does not support colors!
    const isIE = this.isIE();
    if (this.prefixColors && !isIE) {
      this.initializeObjectsBasedOnEnumsLogTypes(this.prefixColors, wantedLoggerConfig.prefixColors);
    }
  }

  private initializeLoggerProcessorsWith(loggerProcessors: LoggerTypesObject<LoggerProcessor[]>) {
    Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
      // tslint:disable-next-line:prefer-conditional-expression
      if (loggerProcessors[logType]) {
        this.loggerProcessors![logType] = loggerProcessors[logType];
      } else {
        this.loggerProcessors![logType] = [];
      }
    });
  }

  private initializeObjectsBasedOnEnumsLogTypes(
    object: LoggerTypesObject<any>,
    configs: LoggerTypesObject<any> | undefined
  ) {
    if (!configs) {
      return;
    }

    Helpers.LOG_TYPES_ARRAY.forEach((logType) => {
      if (configs[logType]) {
        object[logType] = configs[logType];
      }
    });
  }

  private isIE() {
    if (typeof document === 'undefined') {
      return false;
    }
    // @ts-ignore
    return /*@cc_on!@*/ false || !!document.documentMode;
  }
}
