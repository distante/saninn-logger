declare type LogTypeKeyStringValue = {
    [key in LogTypesEnum]?: string;
};
declare type LogTypeKeyFunctionValue = {
    [key in LogTypesEnum]?: Function;
};
export declare enum LogTypesEnum {
    log = "log",
    dir = "dir",
    warn = "warn",
    error = "error"
}
export interface ISaninnLoggerConfig {
    prefix?: string;
    prefixColors?: LogTypeKeyStringValue;
    printToConsole?: boolean;
    extraLoggerFunctions?: LogTypeKeyFunctionValue;
}
export declare class SaninnLogger {
    private prefix?;
    private prefixColors;
    private extraLoggerFunctions;
    private printToConsole;
    constructor(loggerConfig?: string | ISaninnLoggerConfig);
    readonly log: Function;
    readonly warn: Function;
    readonly dir: Function;
    readonly error: Function;
    private getConsoleHandlerFor;
    private initializeObjectsBasedOnEnumsLogTypes;
}
export {};
