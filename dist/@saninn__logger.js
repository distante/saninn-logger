"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogTypesEnum;
(function (LogTypesEnum) {
    LogTypesEnum["log"] = "log";
    LogTypesEnum["dir"] = "dir";
    LogTypesEnum["warn"] = "warn";
    LogTypesEnum["error"] = "error";
})(LogTypesEnum = exports.LogTypesEnum || (exports.LogTypesEnum = {}));
var SaninnLogger = /** @class */ (function () {
    function SaninnLogger(loggerConfig) {
        this.prefixColors = {};
        this.extraLoggerFunctions = {};
        this.printToConsole = true;
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
    Object.defineProperty(SaninnLogger.prototype, "log", {
        // TODO: There should be a way to make this automatically from the Enum...
        get: function () {
            return this.getConsoleHandlerFor(LogTypesEnum.log);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaninnLogger.prototype, "warn", {
        get: function () {
            return this.getConsoleHandlerFor(LogTypesEnum.warn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaninnLogger.prototype, "dir", {
        get: function () {
            return this.getConsoleHandlerFor(LogTypesEnum.dir);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaninnLogger.prototype, "error", {
        get: function () {
            return this.getConsoleHandlerFor(LogTypesEnum.error);
        },
        enumerable: true,
        configurable: true
    });
    SaninnLogger.prototype.getConsoleHandlerFor = function (logType) {
        var extraFunction = this.extraLoggerFunctions[logType];
        if (extraFunction) {
            extraFunction();
        }
        if (!this.printToConsole) {
            // tslint:disable-next-line:no-empty
            return function () { };
        }
        if (!this.prefix) {
            return console[logType].bind(console);
        }
        var prefixString = "[" + this.prefix + "]:";
        if (!this.prefixColors[logType]) {
            return console[logType].bind(console, prefixString);
        }
        return console[logType].bind(console, "%c" + prefixString, "color: " + this.prefixColors[logType]);
    };
    SaninnLogger.prototype.initializeObjectsBasedOnEnumsLogTypes = function (object, configs) {
        if (!configs) {
            return;
        }
        var logTypesArray = Object.keys(LogTypesEnum);
        logTypesArray.forEach(function (logType) {
            if (configs[logType]) {
                object[logType] = configs[logType];
            }
        });
    };
    return SaninnLogger;
}());
exports.SaninnLogger = SaninnLogger;
//# sourceMappingURL=@saninn__logger.js.map