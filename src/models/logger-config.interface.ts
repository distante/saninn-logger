import { LoggerTypesObject, LoggerTypesObjectForColors } from './type-definitions';

export interface ILoggerConfig {
  /** The prefix to be appended before the log message */
  prefix?: string;
  /** A valid CSS string color for the prefix (where it is supported). Examples: red | #ffbbss | rgb(255,10,2) | rgba(255,10,2,1)  */
  prefixColors?: LoggerTypesObjectForColors;
  /**
   * If enabled the log output will be printed locally in console.
   * SaninnLogger will keep the line of the call unless #processExternalLoggers is true
   */
  printToConsole?: boolean;
  /** This function will be called before the console prints their output */
  preLoggerFunctions?: LoggerTypesObject<Function>;

  /**
   * If actived the array of functions on extraLoggerFunctions will be called after
   * every console function.
   * IMPORTANT: when this is enabled the SaninnLogger will lose the console position
   * because there is no way to get the console message without proxy it.
   */
  extraLoggerProcessors?: LoggerTypesObject<Function[]>;
}
