'use strict';
const fs=require('node:fs'),path=require('node:path');
function loadMeasuredCases(){
 const directory=path.resolve(__dirname,'../tests/fixtures/measured');
 return fs.readdirSync(directory).filter(name=>name.endsWith('.json')).sort()
  .map(name=>JSON.parse(fs.readFileSync(path.join(directory,name),'utf8')));
}
module.exports={loadMeasuredCases};
