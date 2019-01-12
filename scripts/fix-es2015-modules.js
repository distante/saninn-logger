/** Path fix function based one made byhttps://github.com/QuantumInformation  */
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
      if (!data.match(/(import|export) .* from/g)) {
        return;
      }

      const scriptImports = data.match(/((import|export) .* from\s+['"])(.*)(?=['"])/g);
      let newData = data;
      scriptImports.forEach(script => {
        newData = newData.replace(script, script + '.js');
      });

      // let newData = data.replace(/((import|export) .* from\s+['"])(.*)(?=['"])/g, '$1.js');

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
