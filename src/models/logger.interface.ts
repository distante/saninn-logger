import { LoggerTypesEnum } from './log-types.enum';
import { ILoggerActions } from './logger-actions.interface';
import { LoggerProcessor } from './type-definitions';

export interface ILogger extends ILoggerActions {
  enableGlobalLoggerFunctions(): void;
  disableGlobalLoggerFunctions(): void;
  enableLoggerProcessors(): void;
  disableLoggerProcessors(): void;
  addLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void;
  removeLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void;
}
