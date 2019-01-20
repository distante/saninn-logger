# @saninn/logger

A configurable wrapper around the console object made in typescript (without losing the console call position)

## Install

`npm install @saninn/logger`.

If you want to use it as es6, commonjs or iife import just clone this project, run `npm install` and `npm run build`. You will

## Basic usage

### Typescript

```ts
import { SaninnLogger } from '@saninn/logger';
const myLogger = new SaninnLogger('my-logger-prefix');
myLogger.log('this is a log'); // [my-logger-prefix]: this is a log.
```

If you need to use it directly on an es6 or es5 project then clone the project, run `npm install` and `build-bundles`, you will get a `dist-bundles` directory with `commonjs`, `es6` and `iife` versions.

```ts
import { SaninnLogger } from '@saninn/logger';
const myLogger = new SaninnLogger('my-logger-prefix');
myLogger.log('this is a log'); // [my-logger-prefix]: this is a log.
```

## Configuration Options

```ts
prefix?: string;
/** The prefix to be appended before the log message */

prefixColors?: {log: string, warn: string, error: string};
/** A valid CSS string color for the prefix (where it is supported). Examples: red | #ffbbss | rgb(255,10,2) | rgba(255,10,2,1)  */

printToConsole?: boolean;
/** Call window.console / global.console or just call #extraLoggerFunction */

extraLoggerFunctions?: {log: () =>{}, dir: () =>{}, warn: () =>{}, error: () =>{}};
/** This function will be called before the console prints their output */
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

[MIT](/LICENSE)

## Pull Requests Are Welcome

❤

# Contact me at

- Website [https://www.saninnsalas.com](https://www.saninnsalas.com)
- Twitter [@SaninnSalas](https://twitter.com/saninnsalas)
- Facebook [@SaninnSalas](https://www.facebook.com/SaninnSD/)
