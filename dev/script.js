// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console
import { SaninnLogger } from '../dist/index.js';
console.dir(SaninnLogger);
const loggerWithString = new SaninnLogger('just-with-string');
const loggerWithFullConfig = new SaninnLogger({
  preLoggerFunctions: {
    dir: prefix => {
      console.log(
        'This is a DIR preLoggerFunction that is not the direct console.dir',
        'This is The Prefix:  ' + prefix
      );
    },
    error: prefix => {
      console.log(
        'This is a ERROR preLoggerFunction that is not the direct console.error',
        'This is The Prefix:  ' + prefix
      );
    },
    log: prefix => {
      console.log(
        'This is a LOG preLoggerFunction that is not the direct console.log',
        'This is The Prefix:  ' + prefix
      );
    },
    warn: prefix => {
      console.log(
        'This is a WARN preLoggerFunction that is not the direct console.warn',
        'This is The Prefix:  ' + prefix
      );
    }
  },
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red'
  },
  printToConsole: true
});

const loggerWithFullConfigAndProcessors = new SaninnLogger({
  preLoggerFunctions: {
    dir: prefix => {
      console.log(
        'This is a DIR preLoggerFunction that is not the direct console.dir',
        'This is The Prefix:  ' + prefix
      );
    },
    error: prefix => {
      console.log(
        'This is a ERROR preLoggerFunction that is not the direct console.error',
        'This is The Prefix:  ' + prefix
      );
    },
    log: prefix => {
      console.log(
        'This is a LOG preLoggerFunction that is not the direct console.log',
        'This is The Prefix:  ' + prefix
      );
    },
    warn: prefix => {
      console.log(
        'This is a WARN preLoggerFunction that is not the direct console.warn',
        'This is The Prefix:  ' + prefix
      );
    }
  },
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red'
  },
  printToConsole: true,
  useLoggerProcessors: true,
  loggerProcessors: {
    log: [
      (prefix, message) => {
        console.log('logger Processor para saninnLogger.log');
      }
    ]
  }
});

console.log('loggerWithString\n', loggerWithString);
console.log('loggerWithFullConfig\n', loggerWithFullConfig);
console.log('loggerWithFullConfigAndProcessors\n', loggerWithFullConfigAndProcessors);
console.log('\n\n');
// loggerWithString.log();
// loggerWithString.log('Regular log');
// loggerWithFullConfig.log('trying log');
// loggerWithFullConfig.dir('trying dir');
// loggerWithFullConfig.warn('trying warn');
// loggerWithFullConfig.error('trying error');

// loggerWithString.log('log of loggerWithString');
// loggerWithFullConfig.log('log of loggerWithFullConfig');
loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors');
