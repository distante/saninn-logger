// tslint:disable:no-string-literal
// tslint:disable:no-console
const scriptName = 'RELEASE IT AFTER BUMP';
const shell = require('shelljs');
const path = require('path');
const distBundlesDir = path.join(process.cwd(), 'dist-bundles');

const version = process.argv[2] && process.argv[2].length ? 'v' + process.argv[2] + '-' : '';

console.log(`\n🚀🚀🚀    ${scriptName}    🚀🚀🚀 \n`);
if (version === '') {
  console.log('There was no version given, zip files were not renamed');
} else {
  const bundleFiles = shell.find(`${distBundlesDir}/*.zip`);

  bundleFiles.forEach(zipFileCompletePath => {
    const file = path.parse(zipFileCompletePath);

    if (file.name.indexOf(version) !== -1) {
      console.warn(`❗ ${file.name}${file.ext} already contains the version`);
      return;
    }

    const newName = path.join(file.dir, `${version}${file.name}${file.ext}`);
    shell.mv(zipFileCompletePath, newName);
    console.log('📄  -> 📄  zip file renamed: ' + newName);
  });
}

console.log(`\n👍  ${scriptName} done 👍 `);
