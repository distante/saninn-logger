// tslint:disable:no-string-literal
// tslint:disable:no-console
const scriptName = 'RELEASE IT BEFORE START';
const shell = require('shelljs');
const path = require('path');
const objectWithRawScripts = require(path.join(process.cwd(), 'package.json')).scripts;

//Create CNAME for docs
const cnameFile = path.join(process.cwd(), 'docs', 'CNAME');
fs.writeFileSync(cnameFile, 'logger.saninnsalas.com', function(err) {
  if (err) {
    throw err;
  }
  // tslint:disable-next-line:no-console
  console.log('CNAME saved! in ' + cnameFile);
});

//create .nojekyll fix
const nojekyll = path.join(process.cwd(), 'docs', '.nojekyll');
fs.writeFileSync(nojekyll, '', function(err) {
  if (err) {
    throw err;
  }
  // tslint:disable-next-line:no-console
  console.log('nojekyll saved! in ' + nojekyll);
});

const packageScripts = {
  build: objectWithRawScripts['build'],
  buildBundles: objectWithRawScripts['build-bundles'],
  prettierCheck: objectWithRawScripts['prettier:check'],
  test: objectWithRawScripts['test'],
  tscCheck: objectWithRawScripts['tsc:check'],
  zipBundles: objectWithRawScripts['zip-bundles']
};

function runScript(scriptToRun) {
  try {
    console.log(`\n
🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  🏃‍  🏃‍  🏃‍  🏃‍  🏃‍  🏃‍  
🏃‍  
🏃‍    ☕   Running ${scriptToRun} 
🏃‍  
🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  ‍🏃‍  🏃‍  🏃‍  🏃‍  🏃‍  🏃‍  🏃‍  \n`);
    shell.exec(scriptToRun);
  } catch (e) {
    shell.echo('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    shell.echo(`there was an error with ${scriptToRun}`);
    console.error(e);
    shell.echo('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return false;
  }
  return true;
}

console.log(`\n🚀🚀🚀    ${scriptName}    🚀🚀🚀 \n`);

runScript(packageScripts.test + ' --silent'); // npm run test
runScript(packageScripts.tscCheck); // npm run tsc:check
shell.exec('rm -rf ./dist-bundles/*');
runScript(packageScripts.build); // npm run build
runScript(packageScripts.buildBundles); // npm run build-bundles"
//  TODO: > -> Uglyfiy
runScript(packageScripts.zipBundles); // create zip versions

console.log(`\n👍  ${scriptName} done 👍 `);
