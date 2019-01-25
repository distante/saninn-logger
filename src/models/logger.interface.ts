import { ILoggerActions } from './logger-actions.interface';

export interface ILogger extends ILoggerActions {
  enableLoggerProcessors(): void;
  disableLoggerProcessors(): void;
  addLoggerProcessor(): void;
  removeLoggerProcessor(): void;
}
