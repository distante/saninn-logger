import { LoggerTypesEnum } from './log-types.enum';
/**
 * Yes, this is a type but it will be used as an interface ;)
 */
export type ILoggerActions = { [key in LoggerTypesEnum]: Function };