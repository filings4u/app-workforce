import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd();
let checked=0;
const errors=[];
function crawl(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(entry.name==='.git'||entry.name==='node_modules')continue;
  const full=path.join(dir,entry.name);
  if(entry.isDirectory())crawl(full);
  else if(entry.name.endsWith('.html')){
   const html=fs.readFileSync(full,'utf8');
   const re=/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/g;
   for(const match of html.matchAll(re)){
    const src=match[1];if(/^(https?:)?\/\//.test(src)||src.startsWith('data:'))continue;
    const abs=path.resolve(path.dirname(full),src.split('?')[0].split('#')[0]);
    checked++;
    if(!abs.startsWith(root+path.sep)||!fs.existsSync(abs))errors.push(path.relative(root,full)+': missing '+src);
   }
  }
 }
}
crawl(root);for(const e of errors)console.error(e);
assert.equal(errors.length,0,errors.length+' missing local script dependencies');console.log('Verified '+checked+' local HTML script references.');
