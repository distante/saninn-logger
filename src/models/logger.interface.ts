import { LoggerTypesEnum } from './log-types.enum';
import { ILoggerActions } from './logger-actions.interface';
import { LoggerProcessor } from './type-definitions';

export interface ILogger extends ILoggerActions {
  setPrefixTo(newPrefix: string): void;
  /**
   * Will set all outputs like {@link ILoggerConfig.printToConsole}, {@link ILoggerConfig.useLoggerProcessors}, {@link ILoggerConfig.useGlobalPreLoggerFunctions} to false.
   */
  disableAll(): void;
  enablePrintToConsole(): void;
  disablePrintToConsole(): void;
  enableGlobalLoggerFunctions(): void;
  disableGlobalLoggerFunctions(): void;
  enableLoggerProcessors(): void;
  disableLoggerProcessors(): void;
  addLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void;
  removeLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void;
}
