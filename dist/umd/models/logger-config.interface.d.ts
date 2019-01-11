import { LogTypeKeyFunctionValue, LogTypeKeyStringValue } from './type-definitions';
export interface ILoggerConfig {
    prefix?: string;
    prefixColors?: LogTypeKeyStringValue;
    printToConsole?: boolean;
    extraLoggerFunctions?: LogTypeKeyFunctionValue;
}
