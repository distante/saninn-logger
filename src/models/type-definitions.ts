import { LoggerTypesEnum } from './log-types.enum';

export type LoggerTypesObject<T> = { [key in LoggerTypesEnum]?: T };
export type LoggerTypesObjectForColors = { [key in Exclude<LoggerTypesEnum, LoggerTypesEnum.dir>]?: string };
// export type LoggerTypesForColorObject<T> = Omit<LoggerTypesObject<T>, LoggerTypesEnum.dir>;
