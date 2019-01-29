/**
 * A really powerfull Enum that controls which getters/logger functions
 * exists on SaninnLogger and also the structure of each configuration
 * object that needs to be indivisual to every logger function.
 */
export enum LoggerTypesEnum {
  log = 'log',
  dir = 'dir',
  warn = 'warn',
  error = 'error'
}
