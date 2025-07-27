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

var loggerWithFullConfigAndProcessors__Processors = {
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
};

var loggerWithFullConfigAndProcessorsButNoOutput__Processors = {
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
};
