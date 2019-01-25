import { SaninnLogger } from '../dist/index.js';
console.dir(SaninnLogger);
const loggerWithString = new SaninnLogger('just-with-string');
const loggerWithFullConfig = new SaninnLogger({
  extraLoggerFunctions: {
    dir: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a DIR callback that is not the direct console.dir', 'This is The Prefix:  ' + prefix);
    },
    error: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a ERROR callback that is not the direct console.error', 'This is The Prefix:  ' + prefix);
    },
    log: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a LOG callback that is not the direct console.log', 'This is The Prefix:  ' + prefix);
    },
    warn: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a WARN callback that is not the direct console.warn', 'This is The Prefix:  ' + prefix);
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

// console.dir(loggerWithString);
console.dir(loggerWithFullConfig);
// loggerWithString.log();
// loggerWithString.log('Regular log');
// loggerWithFullConfig.log('trying log');
// loggerWithFullConfig.dir('trying dir');
// loggerWithFullConfig.warn('trying warn');
// loggerWithFullConfig.error('trying error');

loggerWithFullConfig.log('Regular log');
