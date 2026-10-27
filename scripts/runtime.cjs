'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
// Audit tools share the application's declared order without loading any UI.
function loadRuntime(){
 const context=vm.createContext({console});context.window=context;
 for(const file of require('./entrypoints.cjs').browser.filter(file=>file.startsWith('data/')||file.startsWith('domain/')))
  vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',file),'utf8'),context,{filename:file});
 return context;
}
module.exports={loadRuntime};
