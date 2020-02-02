/*!
 *  @license
 *
 *  Copyright Saninn Salas Diaz All Rights Reserved.
 *
 *  Released under the MIT License
 *
 *  http://www.saninnsalas.com
 */
import { LoggerTypesEnum } from './models/log-types.enum';
import { ILoggerConfig } from './models/logger-config.interface';
import { ILogger } from './models/logger.interface';
import { LoggerProcessor, LoggerTypesObject, RequiredLoggerConfig } from './models/type-definitions';

// let saninnLoggerInstanceCounter = 0;

export class SaninnLogger implements ILogger {
  public static readonly LOG_TYPES_ARRAY: LoggerTypesEnum[] = Object.keys(LoggerTypesEnum) as LoggerTypesEnum[];
  private readonly config: RequiredLoggerConfig = {
    prefix: '',
    prefixColors: {},
    printToConsole: true,
    useGlobalPreLoggerFunctions: false,
    globalPreLoggerFunctions: {},
    useLoggerProcessors: false,
    loggerProcessors: {},
    showLoggerFunctionNames: false
  };

  // tslint:disable-next-line:no-empty
  private readonly consoleFunctionProxys: LoggerTypesObject<Function> = {};
  private readonly consoleProxyHandler: ProxyHandler<Console> = {
    get: (target: Console, prop: LoggerTypesEnum) => {
      if (this.config.useLoggerProcessors) {
        return this.consoleFunctionProxys[prop];
      } else {
        return target[prop];
      }
    }
  };

  private readonly consoleProxy = new Proxy(console, this.consoleProxyHandler);

  constructor(loggerConfig?: string | ILoggerConfig) {
    // saninnLoggerInstanceCounter++;
    // this.loggerId = `SaninnLogger_${Date.now()}_${saninnLoggerInstanceCounter}`;

    this.initProxy();

    if (!loggerConfig) {
      return;
    }

    if (typeof loggerConfig === 'string') {
      this.config.prefix = loggerConfig;
      return;
    }

    this.config.prefix = loggerConfig.prefix || '';

    this.config.useLoggerProcessors = !!loggerConfig.useLoggerProcessors;

    this.config.showLoggerFunctionNames = !!loggerConfig.showLoggerFunctionNames;

    if (loggerConfig.loggerProcessors) {
      this.initializeLoggerProcessorsWith(loggerConfig.loggerProcessors);
    }

    this.config.useGlobalPreLoggerFunctions = !!loggerConfig.useGlobalPreLoggerFunctions;

    // Since printToConsole is true by default this is the safest way to assign it.
    if (typeof loggerConfig.printToConsole !== 'undefined') {
      this.config.printToConsole = loggerConfig.printToConsole;
    }

    if (this.config.globalPreLoggerFunctions) {
      this.initializeObjectsBasedOnEnumsLogTypes(
        this.config.globalPreLoggerFunctions,
        loggerConfig.globalPreLoggerFunctions
      );
    }

    // IE does not support colors!
    const isIE = this.isIE();
    if (this.config.prefixColors && !isIE) {
      this.initializeObjectsBasedOnEnumsLogTypes(this.config.prefixColors, loggerConfig.prefixColors);
    }
  }

  //    ██████  ██    ██ ██████  ██      ██  ██████
  //    ██   ██ ██    ██ ██   ██ ██      ██ ██
  //    ██████  ██    ██ ██████  ██      ██ ██
  //    ██      ██    ██ ██   ██ ██      ██ ██
  //    ██       ██████  ██████  ███████ ██  ██████

  public setPrefixTo(newPrefix: string) {
    this.config.prefix = newPrefix;
  }

  public disableAll() {
    this.disablePrintToConsole();
    this.disableLoggerProcessors();
    this.disableGlobalLoggerFunctions();
  }

  public enablePrintToConsole() {
    this.config.printToConsole = true;
  }

  public disablePrintToConsole() {
    this.config.printToConsole = false;
  }

  public addLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor) {
    this.config.loggerProcessors![logType]!.push(loggerProcessor);
  }

  public removeLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor) {
    const indexToRemove = this.config.loggerProcessors![logType]!.indexOf(loggerProcessor);
    if (indexToRemove !== -1) {
      this.config.loggerProcessors![logType]!.splice(indexToRemove, 1);
    }
  }

  public enableLoggerProcessors() {
    this.config.useLoggerProcessors = true;
  }

  public disableLoggerProcessors() {
    this.config.useLoggerProcessors = false;
  }

  public enableGlobalLoggerFunctions() {
    this.config.useGlobalPreLoggerFunctions = true;
  }

  public disableGlobalLoggerFunctions() {
    this.config.useGlobalPreLoggerFunctions = false;
  }

  //    ██████  ███████ ████████ ████████ ███████ ██████  ███████
  //   ██       ██         ██       ██    ██      ██   ██ ██
  //   ██   ███ █████      ██       ██    █████   ██████  ███████
  //   ██    ██ ██         ██       ██    ██      ██   ██      ██
  //    ██████  ███████    ██       ██    ███████ ██   ██ ███████

  // TODO: There should be a way to make this automatically from the Enum...
  // TODO: Or could I use Proxy here???
  get log(): typeof console.log {
    return this.getConsoleHandlerFor(LoggerTypesEnum.log);
  }

  get warn(): typeof console.warn {
    return this.getConsoleHandlerFor(LoggerTypesEnum.warn);
  }

  /**
   * console.dir does not accept multiparameters
   * if you log `logger.dir(x,y)` `y` will be ignored
   */
  get dir(): typeof console.dir {
    return this.getConsoleHandlerFor(LoggerTypesEnum.dir);
  }

  get error(): typeof console.error {
    return this.getConsoleHandlerFor(LoggerTypesEnum.error);
  }

  get debug(): typeof console.debug {
    return this.getConsoleHandlerFor(LoggerTypesEnum.debug);
  }

  //    ██████  ██████  ██ ██    ██  █████  ████████ ███████
  //    ██   ██ ██   ██ ██ ██    ██ ██   ██    ██    ██
  //    ██████  ██████  ██ ██    ██ ███████    ██    █████
  //    ██      ██   ██ ██  ██  ██  ██   ██    ██    ██
  //    ██      ██   ██ ██   ████   ██   ██    ██    ███████

  /**
   * This function will be retorned as console[log|warn|dir,etc] handle when
   * the output is disabled with {@link SaninnSalas#config.printToConsole} = false
   *
   */
  // tslint:disable-next-line:no-empty
  private readonly emptyConsoleFunction = () => {};

  private initializeLoggerProcessorsWith(loggerProcessors: LoggerTypesObject<LoggerProcessor[]>) {
    SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
      // tslint:disable-next-line:prefer-conditional-expression
      if (loggerProcessors[logType]) {
        this.config.loggerProcessors![logType] = loggerProcessors[logType];
      } else {
        this.config.loggerProcessors![logType] = [];
      }
    });
  }

  private initProxy() {
    SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
      const consoleFunctionHandler: ProxyHandler<Function> = {
        // tslint:disable-next-line:object-literal-shorthand
        apply: (target, consoleObject, argumentsList) =>
          this.consoleFunctionProxyApply(target, consoleObject, argumentsList, logType)
      };
      this.consoleFunctionProxys[logType] = new Proxy(console[logType], consoleFunctionHandler);
      // console.error(this.consoleFunctionProxys[logType]);
    });
  }

  /**
   * @param nativeConsoleFunction - The native console.log Function
   * @param _nativeConsoleObject - window.console / global.console
   * @param argumentsList - contains all arguments sended to console.x(), including prefix, color, etc
   * @returns void
   */
  private consoleFunctionProxyApply(
    nativeConsoleFunction: Function,
    // tslint:disable-next-line:variable-name
    _nativeConsoleObject: Console,
    argumentsList: any[],
    logType: LoggerTypesEnum
  ) {
    if (this.config.loggerProcessors![logType] && this.config.loggerProcessors![logType]!.length) {
      this.runLoggerProcessorsOf(logType, argumentsList);
    }
    if (this.config.printToConsole) {
      // Needed for IE10 https://stackoverflow.com/a/5539378/1255819
      const bindedFunction = Function.prototype.bind.call(nativeConsoleFunction, console);
      return bindedFunction.apply(void 0, argumentsList);
    }
  }

  private runLoggerProcessorsOf(logType: LoggerTypesEnum, rawArgumentList: any[]) {
    let initialIndexOfArguments = 0;
    const prefix = this.config.prefix;

    if (logType !== LoggerTypesEnum.dir && this.config.prefix) {
      initialIndexOfArguments++;
      if (this.config.prefixColors![logType]) {
        initialIndexOfArguments++;
      }
    }

    const argumentsList = rawArgumentList.slice(initialIndexOfArguments);

    // TODO: Use it with the observer pattern?
    this.config.loggerProcessors![logType]!.forEach(loggerProcessor => {
      loggerProcessor(prefix!, argumentsList);
    });
  }

  private getConsoleHandlerFor(logType: LoggerTypesEnum): typeof console[LoggerTypesEnum] {
    const extraFunctionForThisLogType = this.config.globalPreLoggerFunctions![logType];

    // TODO: add an callback for when this function is done?????
    if (this.config.useGlobalPreLoggerFunctions && extraFunctionForThisLogType) {
      extraFunctionForThisLogType(this.config.prefix!);
    }

    if (!this.config.printToConsole && !this.config.useLoggerProcessors) {
      return this.emptyConsoleFunction as any;
    }

    let logTypeToPrint = '';
    if (this.config.showLoggerFunctionNames && logType !== LoggerTypesEnum.dir) {
      logTypeToPrint = `[${logType.toUpperCase()}]`;
    }

    if (!this.config.prefix && !this.config.showLoggerFunctionNames) {
      return this.consoleProxy[logType].bind(console) as any;
    } else if (!this.config.prefix && logTypeToPrint.length && logType !== LoggerTypesEnum.dir) {
      return this.consoleProxy[logType].bind(console, logTypeToPrint + ':') as any;
    } else if (!this.config.prefix) {
      return this.consoleProxy[logType].bind(console) as any;
    }

    const prefixString = `[${this.config.prefix}]${logTypeToPrint}:`;

    // Console.dir does not accept multiparameters,
    // We will add a raw console.log before the dir print
    if (logType === LoggerTypesEnum.dir) {
      // tslint:disable-next-line:no-console
      console.log(prefixString + '(dir after this line)');
      return this.consoleProxy[logType].bind(console) as any;
    }

    if (!this.config.prefixColors![logType]) {
      return this.consoleProxy[logType].bind(console, prefixString) as any;
    }

    return this.consoleProxy[logType].bind(
      console,
      `%c${prefixString}`,
      `color: ${this.config.prefixColors![logType]}`
    ) as any;
  }

  private initializeObjectsBasedOnEnumsLogTypes(
    object: LoggerTypesObject<any>,
    configs: LoggerTypesObject<any> | undefined
  ) {
    if (!configs) {
      return;
    }

    SaninnLogger.LOG_TYPES_ARRAY.forEach(logType => {
      if (configs[logType]) {
        object[logType] = configs[logType];
      }
    });
  }

  private isIE() {
    // @ts-ignore
    return /*@cc_on!@*/ false || !!document.documentMode;
  }
}
