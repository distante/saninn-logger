//append-iife-proxy-polyfill
const fs = require('fs');
const path = require('path');

const polyfillPath = path.join(process.cwd(), 'node_modules', 'proxy-polyfill', 'proxy.min.js');
const iifePath = path.join(process.cwd(), 'dist-bundles', 'iife', '@saninn__logger.js');

const files = [polyfillPath, iifePath];

var output = files
  .map(f => {
    return fs.readFileSync(f).toString();
  })
  .join(';');

fs.writeFileSync(iifePath, output);
