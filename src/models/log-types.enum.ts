/**
 * A really powerfull Enum that controls which getters/logger functions
 * exists on SaninnLogger and also the structure of each configuration
 * object that needs to be indivisual to every logger function.
 */
export enum LoggerTypesEnum {
  debug = 'debug',
  log = 'log',
  info = 'info',
  dir = 'dir',
  warn = 'warn',
  error = 'error',
  fatal = 'fatal',
}
