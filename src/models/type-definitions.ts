import { LogTypesEnum } from './log-types.enum';

export type LogTypeKeyStringValue = { [key in LogTypesEnum]?: string };
export type LogTypeKeyFunctionValue = { [key in LogTypesEnum]?: Function };
export type LogTypeKeyAnyValue = { [key in LogTypesEnum]?: any };
