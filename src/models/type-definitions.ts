import { LoggerTypesEnum } from './log-types.enum';
import { ILoggerConfig } from './logger-config.interface';

export type LoggerTypesObject<T> = { [key in LoggerTypesEnum]?: T };

export type LoggerTypesObjectForColors = { [key in Exclude<LoggerTypesEnum, LoggerTypesEnum.dir>]?: string };

export type Private<T> = { [P in keyof T]: T[P] };

export type RequiredLoggerConfig = Required<ILoggerConfig>;

export type LoggerProcessor = (prefix: string, args: any[]) => void;

// export type LoggerProcessor<T = void> = (prefix: string, args: any[]) => T;

// export type LoggerTypesForColorObject<T> = Omit<LoggerTypesObject<T>, LoggerTypesEnum.dir>;
