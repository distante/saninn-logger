import { LoggerTypesObject } from '../type-definitions';

export interface IExtendedConsoleForLogger extends Console {
  ___SaninnLogger: {
    [key: string]: LoggerTypesObject<Function>;
  };
}
