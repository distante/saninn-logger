import { LogTypeKeyFunctionValue, LogTypeKeyStringValue } from './types';

export interface ILoggerConfig {
    prefix?: string;
    prefixColors?: LogTypeKeyStringValue;
    printToConsole?: boolean;
    extraLoggerFunctions?: LogTypeKeyFunctionValue;
}
