import {build} from '../voxel-island/node_modules/esbuild/lib/main.js';
import {fileURLToPath} from 'node:url';import fs from 'node:fs';import vm from 'node:vm';
const result=await build({entryPoints:[fileURLToPath(new URL('./scene.js',import.meta.url))],bundle:true,write:false,minify:true,format:'iife',legalComments:'inline'});
const js=result.outputFiles[0].text;new vm.Script(js);
const html=fs.readFileSync(new URL('./template.html',import.meta.url),'utf8').replace('/*BUNDLE*/',()=>js.replace(/<\/script/gi,'<\\/script'));
const dest=new URL('../交互作品_离线HTML/云阙_云海浮阁.html',import.meta.url);fs.writeFileSync(dest,html);console.log('Built',dest.pathname,Buffer.byteLength(html),'bytes; JS parse passed; external script URLs:',(html.match(/<script[^>]+src=/g)||[]).length);

