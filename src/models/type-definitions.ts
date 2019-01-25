import { LoggerTypesEnum } from './log-types.enum';
import { ILoggerConfig } from './logger-config.interface';

export type LoggerTypesObject<T> = { [key in LoggerTypesEnum]?: T };
export type LoggerTypesObjectForColors = { [key in Exclude<LoggerTypesEnum, LoggerTypesEnum.dir>]?: string };
export type Private<T> = { [P in keyof T]: T[P] }; // Add readonly and ?
export type RequiredLoggerConfig = Required<ILoggerConfig>;
// export type LoggerTypesForColorObject<T> = Omit<LoggerTypesObject<T>, LoggerTypesEnum.dir>;
