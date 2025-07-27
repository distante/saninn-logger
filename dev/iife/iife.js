'use strict';

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console

console.dir(SaninnLogger);
// tslint:disable-next-line: no-string-literal
window['SaninnLogger'] = SaninnLogger;

var loggerWithString = new SaninnLogger('just-with-string');
var loggerWithFullConfig = new SaninnLogger({
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions: globalPreLoggerFunctions,
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red',
  },
});

var loggerWithFullConfigAndProcessors = new SaninnLogger({
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions: globalPreLoggerFunctions,
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red',
  },
  useLoggerProcessors: true,
  loggerProcessors: loggerWithFullConfigAndProcessors__Processors,
});

var dummyObject = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};

var dummyFunction = function () {
  console.log('dummy function');
};
loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors', dummyObject, dummyFunction);
loggerWithFullConfigAndProcessors.warn('warn of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.error('error of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.dir('dir of loggerWithFullConfigAndProcessors');

var loggerWithFullConfigAndProcessorsButNoOutput = new SaninnLogger({
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions: globalPreLoggerFunctions,
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red',
  },
  useLoggerProcessors: true,
  loggerProcessors: loggerWithFullConfigAndProcessorsButNoOutput__Processors,
});

console.log('loggerWithString\n', loggerWithString);
console.log('loggerWithFullConfig\n', loggerWithFullConfig);
console.log('loggerWithFullConfigAndProcessors\n', loggerWithFullConfigAndProcessors);
console.log('\n\n \n\n loggerWithString STARTS BELOW \n\n \n\n');
loggerWithString.log();
loggerWithString.log('Regular log');
loggerWithFullConfig.log('trying log');
loggerWithFullConfig.dir('trying dir');
loggerWithFullConfig.warn('trying warn');
loggerWithFullConfig.error('trying error');

loggerWithString.log('log of loggerWithString');
loggerWithFullConfig.log('log of loggerWithFullConfig');
loggerWithFullConfig.warn('warn of loggerWithFullConfig');
loggerWithFullConfig.error('error of loggerWithFullConfig');
loggerWithFullConfig.dir('dir of loggerWithFullConfig');

console.log('loggerWithFullConfigAndProcessors', loggerWithFullConfigAndProcessors);
loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors', dummyObject, dummyFunction);
loggerWithFullConfigAndProcessors.warn('warn of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.error('error of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessorsButNoOutput.log(
  'log of loggerWithFullConfigAndProcessorsButNoOutput',
  dummyObject,
  dummyFunction
);

function loggerWithPreprocessorTest(prefix) {
  var loggerShowingLogTagAndPreprocessor = new SaninnLogger({
    showLoggerFunctionNames: false,
    prefix: prefix,
    useLoggerProcessors: true,
    loggerProcessors: {
      log: [
        function (params) {
          console.log('preproccesor prefix:', params.prefix);
          console.log('preproccesor logType:', params.logType);
          console.log('preproccesor args:', params.args);
        },
      ],
    },
  });

  loggerShowingLogTagAndPreprocessor.log('testText without args');
  loggerShowingLogTagAndPreprocessor.log('testText with args', { some: 'args' }, { more: 'args' });
  loggerShowingLogTagAndPreprocessor.log({ just: 'some' }, { args: 'here' });
}

console.log('%cloggerWithPreprocessor', 'font-size:32px; color: blue');
loggerWithPreprocessorTest();

console.log('%cloggerWithPreprocessor and prefix', 'font-size:32px; color: blue');
loggerWithPreprocessorTest('IHaveAPrefix');
