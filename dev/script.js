// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console
import { SaninnLogger } from '../dist/index.js';
console.dir(SaninnLogger);
const loggerWithString = new SaninnLogger('just-with-string');
const loggerWithFullConfig = new SaninnLogger({
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions: {
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
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions: {
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
      (prefix, args) => {
        console.log('FIRST logger Processor para saninnLogger.log');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
      (prefix, args) => {
        console.log('SECOND logger Processor para saninnLogger.log');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      }
    ]
  }
});

const dummyObject = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4
  }
};

const dummyFunction = function() {
  console.log('dummy function');
};
loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors', dummyObject, dummyFunction);
loggerWithFullConfigAndProcessors.warn('warn of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.error('error of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.dir('dir of loggerWithFullConfigAndProcessors');

const loggerWithFullConfigAndProcessorsButNoOutput = new SaninnLogger({
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions: {
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
  printToConsole: false,
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
      }
    ]
  }
});

console.log('loggerWithString\n', loggerWithString);
// console.log('loggerWithFullConfig\n', loggerWithFullConfig);
// console.log('loggerWithFullConfigAndProcessors\n', loggerWithFullConfigAndProcessors);
// console.log('\n\n');
// loggerWithString.log();
// loggerWithString.log('Regular log');
// loggerWithFullConfig.log('trying log');
// loggerWithFullConfig.dir('trying dir');
// loggerWithFullConfig.warn('trying warn');
// loggerWithFullConfig.error('trying error');

loggerWithString.log('log of loggerWithString');
// loggerWithFullConfig.log('log of loggerWithFullConfig');
// loggerWithFullConfig.warn('warn of loggerWithFullConfig');
// loggerWithFullConfig.error('error of loggerWithFullConfig');
// loggerWithFullConfig.dir('dir of loggerWithFullConfig');

// console.log('loggerWithFullConfigAndProcessors', loggerWithFullConfigAndProcessors);
// loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors', dummyObject, dummyFunction);
// loggerWithFullConfigAndProcessors.warn('warn of loggerWithFullConfigAndProcessors');
// loggerWithFullConfigAndProcessors.error('error of loggerWithFullConfigAndProcessors');
// loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors');
// loggerWithFullConfigAndProcessorsButNoOutput.log(
//   'log of loggerWithFullConfigAndProcessorsButNoOutput',
//   dummyObject,
//   dummyFunction
// );
