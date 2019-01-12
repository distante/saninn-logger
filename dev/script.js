import { SaninnLogger } from '../dist/es6/index.js';
const loggerWithString = new SaninnLogger('just-with-string');

const loggerWithFullConfig = new SaninnLogger({
  extraLoggerFunctions: {
    dir: () => {
      // tslint:disable-next-line:no-console
      console.log('This is a DIR callback that is not the direct console.dir');
    },
    error: () => {
      // tslint:disable-next-line:no-console
      console.log('This is a ERROR callback that is not the direct console.error');
    },
    log: () => {
      // tslint:disable-next-line:no-console
      console.log('This is a LOG callback that is not the direct console.log');
    },
    warn: () => {
      // tslint:disable-next-line:no-console
      console.log('This is a WARN callback that is not the direct console.warn');
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

loggerWithString.log('Regular log');
loggerWithFullConfig.log('trying log');
loggerWithFullConfig.dir('trying dir');
loggerWithFullConfig.warn('trying warn');
loggerWithFullConfig.error('trying error');
