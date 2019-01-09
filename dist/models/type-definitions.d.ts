import { LogTypesEnum } from './log-types.enum';
export declare type LogTypeKeyStringValue = {
    [key in LogTypesEnum]?: string;
};
export declare type LogTypeKeyFunctionValue = {
    [key in LogTypesEnum]?: Function;
};
export declare type LogTypeKeyAnyValue = {
    [key in LogTypesEnum]?: any;
};
