import { SaninnLogger } from '../dist/es6/index.js';
console.dir(SaninnLogger);
const loggerWithString = new SaninnLogger('just-with-string');

const loggerWithFullConfig = new SaninnLogger({
  extraLoggerFunctions: {
    dir: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a DIR callback that is not the direct console.dir', 'thisIsTheFrefix ' + prefix);
    },
    error: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a ERROR callback that is not the direct console.error', 'thisIsTheFrefix ' + prefix);
    },
    log: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a LOG callback that is not the direct console.log', 'thisIsTheFrefix ' + prefix);
    },
    warn: prefix => {
      // tslint:disable-next-line:no-console
      console.log('This is a WARN callback that is not the direct console.warn', 'thisIsTheFrefix ' + prefix);
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

loggerWithString.log();
loggerWithString.log('Regular log');
loggerWithFullConfig.log('trying log');
loggerWithFullConfig.dir('trying dir');
loggerWithFullConfig.warn('trying warn');
loggerWithFullConfig.error('trying error');
