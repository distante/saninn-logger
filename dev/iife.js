var loggerWithString = new SaninnLogger('just-with-string');

var loggerWithFullConfig = new SaninnLogger({
  extraLoggerFunctions: {
    dir: function() {
      // tslint:disable-next-line:no-console
      console.log('This is a DIR callback that is not the direct console.dir');
    },
    error: function() {
      // tslint:disable-next-line:no-console
      console.log('This is a ERROR callback that is not the direct console.error');
    },
    log: function() {
      // tslint:disable-next-line:no-console
      console.log('This is a LOG callback that is not the direct console.log');
    },
    warn: function() {
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

loggerWithString.log();
loggerWithString.log('Regular log');
loggerWithFullConfig.log('trying log');
loggerWithFullConfig.dir({
  key: 'trying dir'
});
loggerWithFullConfig.warn('trying warn');
loggerWithFullConfig.error('trying error');
