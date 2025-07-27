<div align="center">
  <h1>@saninn/logger</h1>

<span style="font-size:2em">👨‍💻💻</span>

A configurable wrapper of the console that keeps the log call position.

Made with Typescript, usable as es6 module and iife (with IE10 support).

<div align="center">

[![Build Status](https://github.com/distante/saninn-logger/actions/workflows/node.js.yml/badge.svg)](https://github.com/distante/saninn-logger/actions/workflows/node.js.yml) [![codecov](https://codecov.io/gh/distante/saninn-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/distante/saninn-logger) [![Known Vulnerabilities](https://snyk.io/test/github/distante/saninn-logger/badge.svg?targetFile=package.json)](https://snyk.io/test/github/distante/saninn-logger?targetFile=package.json) [![Maintainability](https://api.codeclimate.com/v1/badges/f7d99fcb6516cac26fde/maintainability)](https://codeclimate.com/github/distante/saninn-logger/maintainability) ![Licence](https://img.shields.io/github/license/distante/saninn-logger.svg)

</div>
</div>

<hr />

## The Problem

You need to control when activate or deactivate your app or website logging but when your put `console.log` inside another class or function the console call position is lost. Well not anymore!

![example][example]

[example]: https://i.imgur.com/NQSB5f5.png 'Saninn Logger Example'

## Install

`npm install @saninn/logger`.

If you want to use it as es6, commonjs or iife download the respective assets in the [Releases Page](https://github.com/distante/saninn-logger/releases/). As alternative you can clone this project, run `npm install` and `npm run build-bundles`.

_Note: The iife version contains a Polyfill for Javascript Proxy Api._

## What can I do?

- Set a prefix to all your console calls(log, warn, error, etc) so it is easy to filter while debugging;
- Add a color to each console calls (supported in all browsers but Internet Explorer).
- Set logger levels to prevent console flood (Debug, Info, Warn, Error and Fatal);
- Process external loggers (like server side) with the same call as the local log.
- Process just external loggers.
- Procces just local loggers.
- Register external loggers on run time.
- Remove external loggers on run time.

## Basic usage

### Typescript

```ts
import { SaninnLogger } from '@saninn/logger';
const myLogger = new SaninnLogger('my-logger-prefix');
myLogger.log('this is a log'); // [my-logger-prefix]: this is a log.
```

### Javascript (es6 module)

#### index.html

```html
<head>
  <script src="main.js" type="module"></script>
</head>
```

#### main.js

```js
import { SaninnLogger } from './node_modules/@saninn/logger/dist/@saninn__logger.js';
const myLogger = new SaninnLogger('my-logger-prefix');
myLogger.log('this is a log'); // [my-logger-prefix]: this is a log.
```

### Javascript (es5)

- First download the Immediately-invoked function expression (iife) from the [Releases Page](https://github.com/distante/saninn-logger/releases/) and import it before your javascript entry point

#### index.html

```html
<head>
  <script src="@saninn__logger.js"></script>
  <script src="main.js"></script>
</head>
```

#### main.js

```js
var myLogger = new SaninnLogger('my-logger-prefix');
myLogger.log('this is a log'); // [my-logger-prefix]: this is a log.
```

## API and Documentation

- [Configuration](https://logger.saninnsalas.com/interfaces/interfaces/ILoggerConfig.html)
- [API](https://logger.saninnsalas.com/classes/SaninnLogger.html)

* `enableGlobalLoggerFunctions(): void`
* `disableGlobalLoggerFunctions(): void`
* `enableLoggerProcessors(): void`
* `disableLoggerProcessors(): void`
* `addLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void`
* `removeLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void`
* `setLoggerLevelTo(level: LogLevelsEnum): void`

**Important!!**

A log level set to `INFO` will print `logger.log()`, `logger.info()` and `logger.dir()` calls.

See the Documentation in [https://logger.saninnsalas.com](https://logger.saninnsalas.com) for full details.

## Use cases

You can see the [Wiki](https://github.com/distante/saninn-logger/wiki) for ideas and use cases where @saninn/logger can help you!

## Full options example

```js
const loggerWithFullConfigAndProcessors = new SaninnLogger({
  useGlobalPreLoggerFunctions: true,
  globalPreLoggerFunctions: {
    dir: (prefix) => {
      console.log(
        'This is a DIR preLoggerFunction that is not the direct console.dir',
        'This is The Prefix:  ' + prefix
      );
    },
    error: (prefix) => {
      console.log(
        'This is a ERROR preLoggerFunction that is not the direct console.error',
        'This is The Prefix:  ' + prefix
      );
    },
    log: (prefix) => {
      console.log(
        'This is a LOG preLoggerFunction that is not the direct console.log',
        'This is The Prefix:  ' + prefix
      );
    },
    warn: (prefix) => {
      console.log(
        'This is a WARN preLoggerFunction that is not the direct console.warn',
        'This is The Prefix:  ' + prefix
      );
    },
  },
  prefix: 'full-config-logger',
  prefixColors: {
    error: 'blue',
    log: 'green',
    warn: 'red',
  },
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
      },
    ],
  },
});

const dummyObject = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};

const dummyFunction = function () {
  console.log('dummy function');
};
loggerWithFullConfigAndProcessors.log('log of loggerWithFullConfigAndProcessors', dummyObject, dummyFunction);
loggerWithFullConfigAndProcessors.warn('warn of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.error('error of loggerWithFullConfigAndProcessors');
loggerWithFullConfigAndProcessors.dir('dir of loggerWithFullConfigAndProcessors');
```

![console output][output]

[output]: https://i.imgur.com/LyJFI7R.png 'console output'

## Use with JEST as test runner.

If you use [jest]() as test runner you need to tell jest not to transform _@saninn/logger_ using this in your jest config:

```
transformIgnorePatterns: ['<rootDir>/node_modules/(?!@saninn|@someOtherPackage)']
```

## License

[MIT](/LICENSE)

## Development

This project uses:

- [Typescript](https://www.npmjs.com/package/typescript) in strict mode.
- [Prettier](https://github.com/prettier/prettier) as code formater.
- [commitlint](https://github.com/marionebl/commitlint) to assure the commits follow the [conventional commit format](https://www.conventionalcommits.org/).
- [jest](https://jestjs.io/) as test runner.

### Scripts

There are 3 scripts I use together for dev (each in their own console): 'watch', 'serve' and 'test'.

- 'npm run watch' will look for Typescript changes and compile it to es6.
- 'npm run serve' will load a local server with './index-es6.html' as entry point. It uses './script.js' as module loader.
- 'npm run test -- --watch --coverage --silent' will run jest tests on each typescript change.

### ToDo

- Pack all development scripts into just one...
- [Project](https://github.com/distante/saninn-logger/projects/1)

## Pull requests are welcome

❤

# Find me 🏃‍

- Website [https://www.saninnsalas.com](https://www.saninnsalas.com)
- Twitter [@SaninnSalas](https://twitter.com/saninnsalas)
- Facebook [@SaninnSalas](https://www.facebook.com/SaninnSD/)
