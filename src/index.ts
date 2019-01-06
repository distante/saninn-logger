type LogTypeKeyStringValue = { [key in LogTypesEnum]?: string };

type LogTypeKeyFunctionValue = { [key in LogTypesEnum]?: Function };
type LogTypeKeyAnyValue = { [key in LogTypesEnum]?: any };

export enum LogTypesEnum {
    log = 'log',
    dir = 'dir',
    warn = 'warn',
    error = 'error'
}

export interface ISaninnLoggerConfig {
    prefix?: string;
    prefixColors?: LogTypeKeyStringValue;
    printToConsole?: boolean;
    extraLoggerFunctions?: LogTypeKeyFunctionValue;
}

export class SaninnLogger {
    private prefix?: string;
    private prefixColors: LogTypeKeyStringValue = {};
    private extraLoggerFunctions: LogTypeKeyFunctionValue = {};
    private printToConsole = true;

    constructor(loggerConfig?: string | ISaninnLoggerConfig) {
        if (!loggerConfig) {
            return;
        }

        if (typeof loggerConfig === 'string') {
            this.prefix = loggerConfig;
            return;
        }

        this.prefix = loggerConfig.prefix || undefined;
        this.printToConsole = loggerConfig.printToConsole || true;

        // we can just use colors in a browser environment
        if (window) {
            this.initializeObjectsBasedOnEnumsLogTypes(this.prefixColors, loggerConfig.prefixColors);
            this.initializeObjectsBasedOnEnumsLogTypes(this.extraLoggerFunctions, loggerConfig.extraLoggerFunctions);
        }
    }

    // TODO: There should be a way to make this automatically from the Enum...
    get log(): Function {
        return this.getConsoleHandlerFor(LogTypesEnum.log);
    }

    get warn(): Function {
        return this.getConsoleHandlerFor(LogTypesEnum.warn);
    }

    get dir(): Function {
        return this.getConsoleHandlerFor(LogTypesEnum.dir);
    }

    get error(): Function {
        return this.getConsoleHandlerFor(LogTypesEnum.error);
    }

    private getConsoleHandlerFor(logType: LogTypesEnum): Function {
        const extraFunction = this.extraLoggerFunctions[logType];
        if (extraFunction) {
            extraFunction();
        }

        if (!this.printToConsole) {
            // tslint:disable-next-line:no-empty
            return () => {};
        }

        if (!this.prefix) {
            return console[logType].bind(console);
        }

        const prefixString = `[${this.prefix}]:`;

        if (!this.prefixColors[logType]) {
            return console[logType].bind(console, prefixString);
        }

        return console[logType].bind(console, `%c${prefixString}`, `color: ${this.prefixColors[logType]}`);
    }

    private initializeObjectsBasedOnEnumsLogTypes(object: LogTypeKeyAnyValue, configs: LogTypeKeyAnyValue | undefined) {
        if (!configs) {
            return;
        }

        const logTypesArray: LogTypesEnum[] = Object.keys(LogTypesEnum) as LogTypesEnum[];

        logTypesArray.forEach(logType => {
            if (configs[logType]) {
                object[logType] = configs[logType];
            }
        });
    }
}
