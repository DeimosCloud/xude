#!/usr/bin/env node

const figlet = require('figlet');
const colors = require('color/safe');
const { program } = require('commander');

const util = require('util');
const ch_proc = require('child_process');


const $PWD = process.cwd()
const JS_EOL = "\r\n"

let output = {};

let exec = util.promisify(ch_proc.exec)
let cmdAsciiTextWriter = util.promisify(figlet);

async function heading(){
  console.log(colors.green.bold.underline(JS_EOL + 'Now Running Post-Merge Hook... ' + JS_EOL + JS_EOL));
  
  return await cmdAsciiTextWriter('XUDE utlity', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
  });
}

async function run_all(cb){

  program
  .command('xude')
  .description('perform migration/install checks on the"post-merge" hook')
  .version('0.0.1')
  .requiredOption('-p, --proj', 'specify the project framework')
  .option('-d, --driver', 'specify the driver for the task')
  .requiredOption('-c, --check', 'specify the task to check')
  .action(cb);

  return await program.parseAsync(process.argv);
}

async function migration_task() {
   // @TODO: add more code
}

async function install_task(){
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
   return run_all(async function (_, cmdObj) {
      // @TODO: mode code here
   })
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
