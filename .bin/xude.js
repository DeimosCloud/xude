#!/usr/bin/env node

const figlet = require('figlet');
const colors = require('color/safe');
const util = require('util');
const ch_proc = require('child_process');


const $PWD = process.cwd()
const JS_EOL = "\r\n"

let output = {};

let exec = util.promisify(ch_proc.exec)
let cmdAsciiTextWriter = util.promisify(figlet);

async function heading(){
  console.log(colors.green.bold.underline(JS_EOL + 'Now Running Post-Merge Hook... ' + JS_EOL + JS_EOL))
  return await cmdAsciiTextWriter('XUDE utlity', { });
}

async function npm_install_refresh(){
  let exit_status = 0;
  try {
      let _output = await exec('git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD');
      if(output.stderr === '') {

          const isPackageJSONModified = (_output.stdout.trim().split('\n')).includes("package.json");

          if(isPackageJSONModified) {
              await exec('pkg_skip_preinstall="yes" npm install')
          }

      }
  }catch(ex){ 
       console.log(colors.red.bold.underline(ex.message + JS_EOL + JS_EOL));
       exit_status = 1;
  }
  return exit_status;
}

heading().then(() => {
   return npm_install_refresh()
}).then(function(es) {
  process.exit(es);
}).catch(function(error){
  console.error(error);
  process.exit(1)
});

process.on('unhandledRejection', function(error){
    console.error(error);
    process.exit(1);
});
