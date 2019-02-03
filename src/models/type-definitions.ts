import { LoggerTypesEnum } from './log-types.enum';
import { ILoggerConfig } from './logger-config.interface';

/**
 * Make all properties in T required
 */
type Required<T> = { [P in keyof T]-?: T[P] };
// https://www.stevefenton.co.uk/2017/11/typescript-mighty-morphing-mapped-types/
type Remove<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

export type LoggerTypesObject<T> = { [key in LoggerTypesEnum]?: T };

// export type LoggerTypesObjectForColors = { [key in Exclude<LoggerTypesEnum, LoggerTypesEnum.dir>]?: string }; // TS +2.8
export type LoggerTypesObjectForColors = { [key in Remove<LoggerTypesEnum, LoggerTypesEnum.dir>]?: string };

export type Private<T> = { [P in keyof T]: T[P] };

export type RequiredLoggerConfig = Required<ILoggerConfig>;

export type LoggerProcessor = (prefix: string, args: any[]) => void;

export type PreLoggerFunction = (prefix: string) => void;

// export type LoggerProcessor<T = void> = (prefix: string, args: any[]) => T;

// export type LoggerTypesForColorObject<T> = Omit<LoggerTypesObject<T>, LoggerTypesEnum.dir>;
