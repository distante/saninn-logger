/**
 * @type {import('../../dist/index.js').ILoggerConfig.globalPreLoggerFunctions}
 */
export const globalPreLoggerFunctions = {
  dir: (prefix) => {
    console.log(
      'This is a DIR globalPreLoggerFunction that is not the direct console.dir',
      'This is The Prefix:  ' + prefix
    );
  },
  error: (prefix) => {
    console.log(
      'This is a ERROR globalPreLoggerFunction that is not the direct console.error',
      'This is The Prefix:  ' + prefix
    );
  },
  fatal: (prefix) => {
    console.log(
      'This is a FATAL globalPreLoggerFunction that is not the direct console.error',
      'This is The Prefix:  ' + prefix
    );
  },
  log: (prefix) => {
    console.log(
      'This is a LOG globalPreLoggerFunction that is not the direct console.log',
      'This is The Prefix:  ' + prefix
    );
  },
  warn: (prefix) => {
    console.log(
      'This is a WARN globalPreLoggerFunction that is not the direct console.warn',
      'This is The Prefix:  ' + prefix
    );
  },
};

/**
 * @type {import('../../dist/index.js').ILoggerConfig}
 */
export const loggerWithFullConfigAndProcessors__Config = {
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions,
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red',
  },
  useLoggerProcessors: true,
  loggerProcessors: {
    log: [
      (prefix, args) => {
        console.log('FIRST logger Processor para saninnLogger.log');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
      (prefix, args) => {
        console.log('SECOND logger Processor para saninnLogger.log');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
    ],
  },
};

/**
 * @type {ILoggerConfig}
 */
export const loggerWithFullConfig_Config = {
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions,
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red',
  },
};

/**
 * @type {import('../../dist/index.js').ILoggerConfig}
 */
export const loggerWithFullConfigAndProcessorsButNoOutput_Config = {
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions,
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red',
  },
  useLoggerProcessors: true,
  loggerProcessors: {
    log: [
      (prefix, args) => {
        console.log('FIRST logger Processor para loggerWithFullConfigAndProcessorsButNoOutput');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
      (prefix, args) => {
        console.log('SECOND logger Processor para loggerWithFullConfigAndProcessorsButNoOutput');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
    ],
  },
};
