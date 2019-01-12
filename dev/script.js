import { SaninnLogger } from '../dist/es6/index.js';
const loggerWithString = new SaninnLogger('just-with-string');

const loggerWithFullConfig = new SaninnLogger({
  prefix: 'full-config-logger',
  prefixColors: {
    dir: 'green',
    error: 'blue',
    log: '#555535',
    warn: 'red'
  },
  printToConsole: true,
  extraLoggerFunctions: {
    dir: () => {
      console.log('This is a DIR callback that is not the direct console.log');
    },
    error: () => {
      console.log('This is a ERROR callback that is not the direct console.error');
    },
    log: () => {
      console.log('This is a LOG callback that is not the direct console.log');
    },
    warn: () => {
      console.log('This is a WARN callback that is not the direct console.warn');
    }
  }
});

loggerWithFullConfig.log('trying log');
loggerWithFullConfig.dir('trying dir');
loggerWithFullConfig.warn('trying warn');
loggerWithFullConfig.error('trying error');
