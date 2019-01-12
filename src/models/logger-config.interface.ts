import { LoggerTypesObject, LoggerTypesObjectForColors } from './type-definitions';

export interface ILoggerConfig {
  /** The prefix to be appended before the log message */
  prefix?: string;
  /** A valid CSS string color for the prefix (where it it supported). Examples: red | #ffbbss | rgb(255,10,2) | rgba(255,10,2,1)  */
  prefixColors?: LoggerTypesObjectForColors;
  /** Call window.console / global.console or just call #extraLoggerFunction */
  printToConsole?: boolean;
  /** This function will be called before the console prints their output */
  extraLoggerFunctions?: LoggerTypesObject<Function>;
}
