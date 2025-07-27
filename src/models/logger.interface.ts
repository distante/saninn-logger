import type { LogLevelsEnum } from './log-levels.enum';
import type { LoggerTypesEnum } from './log-types.enum';
import type { ILoggerActions } from './logger-actions.interface';
import type { LoggerProcessor } from '../type-definitions';
import type { ILoggerConfig } from './logger-config.interface';

export interface ILogger extends ILoggerActions {
  setPrefixTo(newPrefix: string): void;
  /**
   * Will set all outputs like, {@link ILoggerConfig.useLoggerProcessors}, {@link ILoggerConfig.useGlobalPreLoggerFunctions} to false.
   */
  disableAll(): void;
  enableGlobalLoggerFunctions(): void;
  disableGlobalLoggerFunctions(): void;
  enableLoggerProcessors(): void;
  disableLoggerProcessors(): void;
  addLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void;
  removeLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void;
  setLogLevelTo(level: LogLevelsEnum): void;
}
