/** Path fix function based one made byhttps://github.com/QuantumInformation  */
'use strict';

const FileHound = require('filehound');
const fs = require('fs');
// const path = require('path');

const files = FileHound.create()
  .path('./dist-bundles/iife')
  .ext('js')
  .find();

files.then(filePaths => {
  filePaths.forEach(filepath => {
    fs.readFile(filepath, 'utf8', (errorReadingFile, data) => {
      if (!data.match(/return exports;/g)) {
        return;
      }

      const exportString = data.match(/return exports;/g);
      let newData = data;
      exportString.forEach(script => {
        newData = newData.replace(script, 'return SaninnLogger;');
      });

      if (errorReadingFile) {
        throw errorReadingFile;
      }

      fs.writeFile(filepath, newData, function(errorWritingFile) {
        if (errorWritingFile) {
          throw errorWritingFile;
        }
        // tslint:disable-next-line:no-console
        console.log(`SaninnLogger exported in ${filepath}`);
      });
    });
  });
});
