<div align="center">
  <h1>@saninn/logger</h1>

<span style="font-size:2em">👨‍💻💻</span>

A configurable wrapper of the console object with no dependencies (without losing the console call position).

Made with Typescript, usable as es6 module and iife with IE10 support.

<div align="center">

[![Build Status](https://travis-ci.org/distante/saninn-logger.svg?branch=master)](https://travis-ci.org/distante/saninn-logger) [![codecov](https://codecov.io/gh/distante/saninn-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/distante/saninn-logger) ![](https://img.shields.io/github/license/distante/saninn-logger.svg)

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
prefixColors?: {log: string, warn: string, error: string};

/** Call window.console / global.console or just call the extraLoggerFunction */
printToConsole?: boolean (default true);

/** This function will be called before the logger prints their output */
extraLoggerFunctions?: {log: () =>{}, dir: () =>{}, warn: () =>{}, error: () =>{}};

```

## Full options usage

```js
const loggerWithFullConfig = new SaninnLogger({
  extraLoggerFunctions: {
    dir: prefix => {
      console.log('This is a DIR callback that is not the direct console.dir', 'thisIsTheFrefix ' + prefix);
    },
    error: prefix => {
      console.log('This is a ERROR callback that is not the direct console.error', 'thisIsTheFrefix ' + prefix);
    },
    log: prefix => {
      console.log('This is a LOG callback that is not the direct console.log', 'thisIsTheFrefix ' + prefix);
    },
    warn: prefix => {
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
```

![console output][output]

[output]: https://i.imgur.com/6A8IT7H.png 'console output'

## License

## Use cases

You can see the [Wiki](https://github.com/distante/saninn-logger/wiki) for ideas and use cases where @saninn/logger can help you!

[MIT](/LICENSE)

## Pull Requests Are Welcome

❤

# Contact me at

- Website [https://www.saninnsalas.com](https://www.saninnsalas.com)
- Twitter [@SaninnSalas](https://twitter.com/saninnsalas)
- Facebook [@SaninnSalas](https://www.facebook.com/SaninnSD/)
