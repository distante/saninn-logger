import { ILoggerConfig } from './models/logger-config.interface';
export declare class SaninnLogger {
    private prefix?;
    private prefixColors;
    private extraLoggerFunctions;
    private printToConsole;
    constructor(loggerConfig?: string | ILoggerConfig);
    readonly log: Function;
    readonly warn: Function;
    readonly dir: Function;
    readonly error: Function;
    private getConsoleHandlerFor;
    private initializeObjectsBasedOnEnumsLogTypes;
}
