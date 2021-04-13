import { LogLevelsEnum } from './log-levels.enum';
import { LoggerProcessor, LoggerTypesObject, LoggerTypesObjectForColors, PreLoggerFunction } from '../type-definitions';

export interface ILoggerConfig {
  /** The prefix to be appended before the log message */
  prefix?: string;

  /** A valid CSS string color for the prefix (where it is supported). Examples: red | #ffbbss | rgb(255,10,2) | rgba(255,10,2,1)  */
  prefixColors?: LoggerTypesObjectForColors;

  /**
   * If active the function declared on globalPreLoggerFunctions will be called before
   * every loggerProcessor and console function.
   * It DOES NOT Prevent the console to print the correct call line
   */
  useGlobalPreLoggerFunctions?: boolean;

  /**
   * This function will be called before the console prints their output when {@link ILoggerConfig.useGlobalPreLoggerFunctions} is true
   */
  globalPreLoggerFunctions?: LoggerTypesObject<PreLoggerFunction>;

  /**
   * If active the array of functions on {@link ILoggerConfig.loggerProcessors} will be called before
   * every console function, util if you need to send the logs to third party libs or analytics services.
   * IMPORTANT: when this is enabled the SaninnLogger will lose the console position
   * because there is no way to get the console message without proxy it.
   *
   */
  useLoggerProcessors?: boolean;

  /**
   * Object containing an array of [LoggerProcessors]{@link LoggerProcessor} to be called after console log
   * when {@link ILoggerConfig.useLoggerProcessors} is true
   */
  loggerProcessors?: LoggerTypesObject<LoggerProcessor[]>;

  /**
   * Prints the logger name after after the log contents (except for .dir)
   * ```
   * const logger = new SaninnLogger({
   *    showLoggerFunctionNames: true
   *  });
   * logger.log('test') // --> [LOG]: test
   *
   * * const logger = new SaninnLogger({
   *    prefix: 'my-logger',
   *    showLoggerFunctionNames: true
   *  });
   * logger.log('test') // --> [my-logger][LOG]: test
   */
  showLoggerFunctionNames?: boolean;

  /**
   * Any value from  {@link LogLevelsEnum} defaults to LogLevelsEnum.DEBUG
   *
   */
  logLevel?: LogLevelsEnum;
}
