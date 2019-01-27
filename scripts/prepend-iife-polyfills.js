//append-iife-proxy-polyfill
const fs = require('fs');
const path = require('path');

const polyfillPath = path.join(process.cwd(), 'node_modules', 'proxy-polyfill', 'proxy.min.js');
// const objectKeysPath = path.join(process.cwd(), 'node_modules', 'object.keys', 'index.js');
const bundlePath = path.join(process.cwd(), 'dist-bundles', 'iife', '@saninn__logger.js');

const files = [polyfillPath, bundlePath];

var output = files
  .map(f => {
    return fs.readFileSync(f).toString();
  })
  .join(';');

fs.writeFileSync(bundlePath, output);
