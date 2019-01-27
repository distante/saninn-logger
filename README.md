<div align="center">
  <h1>@saninn/logger</h1>

<span style="font-size:2em">👨‍💻💻</span>

A configurable wrapper of the console that keeps the log call position. The only dependency is an included Polyfill!

Made with Typescript, usable as es6 module and iife (with IE10 support).

<div align="center">

[![Build Status](https://travis-ci.org/distante/saninn-logger.svg?branch=master)](https://travis-ci.org/distante/saninn-logger) [![codecov](https://codecov.io/gh/distante/saninn-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/distante/saninn-logger) [![Greenkeeper badge](https://badges.greenkeeper.io/distante/saninn-logger.svg)](https://greenkeeper.io/) ![](https://img.shields.io/github/license/distante/saninn-logger.svg)

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

## Configuration Options

```ts

  /** The prefix to be appended before the log message */
  prefix?: string;

  /** A valid CSS string color for the prefix (where it is supported). Examples: red | #ffbbss | rgb(255,10,2) | rgba(255,10,2,1)  */
  prefixColors?: LoggerTypesObjectForColors;

  /**
   * If enabled the log output will be printed locally in console.
   * SaninnLogger will keep the line of the call unless [ILoggerConfig's useLoggerProcessors property]{@link ILoggerConfig#useLoggerProcessors} is true
   */
  printToConsole?: boolean;

  /** This function will be called before the console prints their output */
  globalPreLoggerFunctions?: LoggerTypesObject<Function>;

  /**
   * If actived the array of functions on extraLoggerFunctions will be called after
   * every console function.
   * IMPORTANT: when this is enabled the SaninnLogger will lose the console position
   * because there is no way to get the console message without proxy it.
   */
  useLoggerProcessors?: boolean;

  /**
   * Object containing an array of {@link LoggerProcessor}s to be called after console log
   * when {@link ILoggerConfig#useLoggerProcessors} is true
   */
  loggerProcessors?: LoggerTypesObject<LoggerProcessor[]>;

```

## Full options usage

```js
const loggerWithFullConfigAndProcessors = new SaninnLogger({
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
```

![console output][output]

[output]: https://i.imgur.com/LyJFI7R.png 'console output'

## API

- `enableGlobalLoggerFunctions(): void`
- `disableGlobalLoggerFunctions(): void`
- `enableLoggerProcessors(): void`
- `disableLoggerProcessors(): void`
- `addLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void`
- `removeLoggerProcessor(logType: LoggerTypesEnum, loggerProcessor: LoggerProcessor): void`

## License

## Use cases

You can see the [Wiki](https://github.com/distante/saninn-logger/wiki) for ideas and use cases where @saninn/logger can help you!

[MIT](/LICENSE)

## Development

This project uses:

- [Typescript](https://www.npmjs.com/package/typescript) in strict mode.
- [Prettier](https://github.com/prettier/prettier) as code formater.
- [commitlint](https://github.com/marionebl/commitlint) to assure the commits follow the [conventional commit format](https://www.conventionalcommits.org/).
- [jest](https://jestjs.io/) as test runner.

### scripts

There are 3 scripts I use together for dev (each in their own console): 'watch', 'serve' and 'test'.

- 'npm run watch' will look for Typescript changes and compile it to es6.
- 'npm run serve' will load a local server with './index-es6.html' as entry point. It uses './script.js' as module loader.
- 'npm run test -- --watch --coverage --silent' will run jest tests on each typescript change.

* TODO: Pack all in one script...

### ToDo

- Generate Auto Docs

## Pull Requests Are Welcome

❤

# Find me 🏃‍

- Website [https://www.saninnsalas.com](https://www.saninnsalas.com)
- Twitter [@SaninnSalas](https://twitter.com/saninnsalas)
- Facebook [@SaninnSalas](https://www.facebook.com/SaninnSD/)
