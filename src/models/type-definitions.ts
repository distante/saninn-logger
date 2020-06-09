import { LoggerTypesEnum } from './log-types.enum';
import { ILoggerConfig } from './logger-config.interface';
import { ILoggerProcessorFunctionParams } from './logger-processor-function-params.interface';

// https://stackoverflow.com/questions/49655419/mapped-types-removing-optional-modifier/49655664#49655664
declare type MakeRequired<T, K extends string> = { [P in K]: (T & { [name: string]: never })[P] };

// https://www.stevefenton.co.uk/2017/11/typescript-mighty-morphing-mapped-types/
declare type Remove<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

export type LoggerTypesObject<T> = { [key in LoggerTypesEnum]?: T };

// export type LoggerTypesObjectForColors = { [key in Exclude<LoggerTypesEnum, LoggerTypesEnum.dir>]?: string }; // TS +2.8
export type LoggerTypesObjectForColors = { [key in Remove<LoggerTypesEnum, LoggerTypesEnum.dir>]?: string };

export type Private<T> = { [P in keyof T]: T[P] };

// export type RequiredLoggerConfig28 = Required<ILoggerConfig>; ; // TS +2.8
export type RequiredLoggerConfig = MakeRequired<ILoggerConfig, keyof ILoggerConfig>;

/**
 * function that is called when {@link ILoggerConfig.useLoggerProcessors} is true
 */
export type LoggerProcessor = (params: ILoggerProcessorFunctionParams) => void;

export type PreLoggerFunction = (prefix: string) => void;

// export type LoggerProcessor<T = void> = (prefix: string, args: any[]) => T;

// export type LoggerTypesForColorObject<T> = Omit<LoggerTypesObject<T>, LoggerTypesEnum.dir>;
