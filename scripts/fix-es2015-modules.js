/** Path fix function by https://github.com/QuantumInformation  */
'use strict';

const FileHound = require('filehound');
const fs = require('fs');
const path = require('path');

const files = FileHound.create()
  .path('./dist')
  .ext('js')
  .find();

files.then(filePaths => {
  filePaths.forEach(filepath => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (!data.match(/import .* from/g)) {
        return;
      }
      let newData = data.replace(/(import .* from\s+['"])(.*)(?=['"])/g, '$1$2.js');
      if (err) throw err;

      console.log(`writing to ${filepath}`);
      fs.writeFile(filepath, newData, function(err) {
        if (err) {
          throw err;
        }
        console.log('complete');
      });
    });
  });
});
