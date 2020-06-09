import { LoggerTypesEnum } from './log-types.enum';

export interface ILoggerProcessorFunctionParams {
  /** it could be an empty string if no prefix is used */
  prefix: string;
  logType: LoggerTypesEnum;
  args: any[];
}
