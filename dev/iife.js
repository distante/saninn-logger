'use strict';

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console

console.dir(SaninnLogger);
// tslint:disable-next-line: no-string-literal
window['SaninnLogger'] = SaninnLogger;

var globalPreLoggerFunctions = {
  dir: function (prefix) {
    console.log(
      'This is a DIR globalPreLoggerFunction that is not the direct console.dir',
      'This is The Prefix:  ' + prefix
    );
  },
  error: function (prefix) {
    console.log(
      'This is a ERROR globalPreLoggerFunction that is not the direct console.error',
      'This is The Prefix:  ' + prefix
    );
  },
  fatal: function (prefix) {
    console.log(
      'This is a FATAL globalPreLoggerFunction that is not the direct console.error',
      'This is The Prefix:  ' + prefix
    );
  },
  log: function (prefix) {
    console.log(
      'This is a LOG globalPreLoggerFunction that is not the direct console.log',
      'This is The Prefix:  ' + prefix
    );
  },
  warn: function (prefix) {
    console.log(
      'This is a WARN globalPreLoggerFunction that is not the direct console.warn',
      'This is The Prefix:  ' + prefix
    );
  },
};

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
  loggerProcessors: {
    log: [
      function (prefix, args) {
        console.log('FIRST logger Processor para saninnLogger.log');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
      function (prefix, args) {
        console.log('SECOND logger Processor para saninnLogger.log');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
    ],
  },
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
  loggerProcessors: {
    log: [
      function (prefix, args) {
        console.log('FIRST logger Processor para loggerWithFullConfigAndProcessorsButNoOutput');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
      function (prefix, args) {
        console.log('SECOND logger Processor para loggerWithFullConfigAndProcessorsButNoOutput');
        console.log('prefix: ', prefix);
        console.log('args: ', args);
      },
    ],
  },
});

console.log('loggerWithString\n', loggerWithString);
console.log('loggerWithFullConfig\n', loggerWithFullConfig);
console.log('loggerWithFullConfigAndProcessors\n', loggerWithFullConfigAndProcessors);
console.log('\n\n');
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
