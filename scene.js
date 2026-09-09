import * as THREE from '../voxel-island/node_modules/three/build/three.module.js';
import {OrbitControls} from '../voxel-island/node_modules/three/examples/jsm/controls/OrbitControls.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color('#cddcdd');
scene.fog=new THREE.Fog('#cddcdd',58,145);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
document.querySelector('#world').append(renderer.domElement);
renderer.domElement.setAttribute('aria-label','云阙三维场景，拖动旋转，滚轮缩放，方向键环绕');renderer.domElement.tabIndex=0;
const camera=new THREE.PerspectiveCamera(36,1,.1,220);camera.position.set(30,23,35);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,4,0);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=19;controls.maxDistance=76;controls.maxPolarAngle=Math.PI*.49;controls.minPolarAngle=.22;controls.autoRotateSpeed=.5;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hemi=new THREE.HemisphereLight('#e9ffff','#746862',2.6);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff0cb',4.3);sun.position.set(-18,30,16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-22,right:22,top:26,bottom:-20,near:1,far:90});sun.shadow.bias=-.0004;sun.shadow.normalBias=.035;scene.add(sun);
const fill=new THREE.DirectionalLight('#b9e2eb',1.2);fill.position.set(15,12,-16);scene.add(fill);
let seed=7821;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}const choose=a=>a[Math.floor(rand()*a.length)];
const C={wood:'#874b32',dark:'#4b3027',light:'#b87c4c',gold:'#cfa15a',stone:'#b4b5a0',jade:'#31766d',leaf:'#50735e'};
const batches=new Map(),geom=new THREE.BoxGeometry(1,1,1);let blocks=0;
function box(x,y,z,w,h,d,color,ry=0){const key=color; if(!batches.has(key))batches.set(key,[]);batches.get(key).push([x,y,z,w,h,d,ry]);blocks++;}
function beam(ax,ay,az,bx,by,bz,width,color){const a=new THREE.Vector3(ax,ay,az),b=new THREE.Vector3(bx,by,bz),m=new THREE.Mesh(geom,new THREE.MeshStandardMaterial({color,roughness:.9}));m.position.copy(a.clone().add(b).multiplyScalar(.5));m.scale.set(width,a.distanceTo(b),width);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());m.castShadow=true;scene.add(m);}
function island(cx,cy,cz,r){for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++){let v=Math.sqrt(x*x+z*z);if(v>r-.3+rand()*.8)continue;let depth=Math.floor((1-v/r)*5+rand()*2)+1;box(cx+x,cy-.22,cz+z,1,.55,1,choose(['#859272','#8f9a78','#a0a984']));for(let j=1;j<=depth;j++)box(cx+x,cy-j*.83,cz+z,.99,.85,.99,choose(['#788484','#88928e','#98a095','#636e72','#b0ae95']));if(v>r-1.6&&rand()>.5)box(cx+x,cy+.12,cz+z,.65,.26,.67,'#668061');}}
island(0,0,0,9);island(-18,-3,-14,3);island(17,-5,-20,4);
// Foundation, terrace and an individual-plank deck.
box(0,.28,0,11,.5,9,C.stone);box(0,.59,0,10.5,.16,8.6,'#d2c9ad');
for(let i=-12;i<=12;i++)box(i*.4,.74,0,.37,.15,8.2,choose([C.light,'#a36b46','#bd8656']));
for(let i=0;i<6;i++){box(0,.12+i*.11,6.8-i*.42,3.25,.24,.48,'#c4c2a7');box(0,.255+i*.11,6.82-i*.42,3.3,.06,.43,'#ded7bb');}
for(let z=7;z<9;z++)for(let x=-1;x<=1;x++)box(x*.85,.075,z,.76,.12,.75,'#c4c4ae');
function rail(x,z,len,y,alongX=true){for(let i=-len/2;i<=len/2+.01;i+=.55){let xx=x+(alongX?i:0),zz=z+(alongX?0:i);box(xx,y+.46,zz,.11,.8,.11,C.dark);box(xx,y+.86,zz,.18,.1,.18,C.gold);}box(x,y+.78,z,alongX?len+.15:.13,.13,alongX?.13:len+.15,C.light);box(x,y+.2,z,alongX?len:.1,.1,alongX?.1:len,C.light);}
rail(-3.55,4,2.7,.8);rail(3.55,4,2.7,.8);rail(0,-4,9.6,.8);rail(-4.8,0,8,.8,false);rail(4.8,0,8,.8,false);
function lantern(x,y,z){box(x,y+.44,z,.045,.55,.045,C.dark);box(x,y,z,.43,.6,.43,'#f5b656');box(x,y+.32,z,.5,.09,.5,C.dark);box(x,y-.32,z,.5,.09,.5,C.dark);for(let a of [-1,1])for(let b of [-1,1])box(x+a*.205,y,z+b*.205,.035,.61,.035,'#b35b36');box(x,y-.48,z,.05,.23,.05,C.gold);}
function floor(y,w,d,h){box(0,y,0,w+.65,.22,d+.65,C.dark);box(0,y+.16,0,w+.8,.12,d+.8,C.light);
 for(let x of [-w/2,0,w/2])for(let z of [-d/2,d/2]){box(x,y+h/2,z,.24,h,.24,C.wood);box(x,y+.27,z,.36,.18,.36,C.gold);box(x,y+h-.2,z,.48,.16,.48,C.light);for(let s of [-1,1]){box(x+s*.2,y+h-.4,z,.2,.17,.4,C.gold);box(x+s*.35,y+h-.25,z,.25,.12,.48,C.light);}}
 for(let z of [-d/2,d/2]){box(0,y+h-.1,z,w+.5,.24,.24,C.wood);box(0,y+.4,z,w,.25,.14,C.dark);for(let x=-w/2+.35;x<w/2;x+=.36){if(z>0&&Math.abs(x)<.75)continue;box(x,y+1.25,z,.055,1.48,.07,C.light);}box(0,y+1.9,z,w,.07,.08,C.light);box(0,y+.65,z,w,.07,.08,C.gold);}
 for(let x of [-w/2,w/2]){box(x,y+h-.1,0,.24,.24,d,C.wood);for(let z=-d/2+.3;z<d/2;z+=.34){box(x,y+1.25,z,.07,1.5,.055,C.light);}for(let yy of [.55,1.05,1.6,2.05])box(x,y+yy,0,.08,.055,d,C.light);}
 // recessed warm screens, open central entrance
 for(let x of [-w*.32,w*.32])box(x,y+1.25,-d/2+.15,w*.24,1.45,.05,'#dac59a');
 for(let x of [-w/2,w/2])for(let z of [-d/2,d/2])lantern(x,y+h-.84,z+.36);
}
function roof(y,w,d,rise){const step=.28;let n=Math.ceil(Math.max(w,d)/step);for(let i=-Math.ceil(w/step/2);i<=Math.ceil(w/step/2);i++)for(let j=-Math.ceil(d/step/2);j<=Math.ceil(d/step/2);j++){
 let x=i*step,z=j*step,t=Math.max(Math.abs(x)/(w/2),Math.abs(z)/(d/2));if(t>1)continue;let lift=Math.pow(1-t,1.65)*rise;let edge=Math.max(0,(t-.76)/.24);let corner=Math.pow(Math.abs(x)/(w/2)*Math.abs(z)/(d/2),5)*.66;let yy=y+lift+edge*edge*.16+corner;
 box(x,yy-.1,z,.277,.4,.277,choose(['#31776f','#397f73','#3e8276','#2a6865','#4c8b7c']));if(t>.93)box(x,yy-.14,z,.285,.12,.285,C.gold);
 }
 // ridge and stepped finials
 for(let i=-4;i<=4;i++)box(i*.29,y+rise+.14,0,.28,.19,.24,C.gold);
 for(let s of [-1,1])for(let k=0;k<4;k++)box(s*(1.3+k*.15),y+rise+.2+k*.15,0,.22,.18,.22,C.jade);
 for(let sx of [-1,1])for(let sz of [-1,1])for(let k=0;k<4;k++)box(sx*(w/2-.25+k*.13),y+.68+k*.13,sz*(d/2-.25+k*.13),.2,.19,.2,C.gold);
}
floor(.9,7,5.8,2.85);roof(3.8,10,8.7,1.8);
floor(5.05,5.5,4.5,2.5);rail(0,2.8,6.4,5.2);rail(-3.2,0,5.6,5.2,false);rail(3.2,0,5.6,5.2,false);rail(0,-2.8,6.4,5.2);roof(7.55,8.25,7.2,1.75);
floor(8.65,3.35,2.8,2.3);roof(10.95,6,5.5,2.15);
box(0,13.35,0,.34,.35,.34,C.gold);box(0,13.7,0,.14,.5,.14,C.gold);
// Signboard on the first facade, generated locally.
const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=192;const ctx=signCanvas.getContext('2d');ctx.fillStyle='#294942';ctx.fillRect(0,0,512,192);ctx.strokeStyle='#cdaa6b';ctx.lineWidth=9;ctx.strokeRect(12,12,488,168);ctx.fillStyle='#efd6a3';ctx.font='bold 105px serif';ctx.textAlign='center';ctx.fillText('云 阙',256,132);const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.56),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(signCanvas),roughness:1}));sign.position.set(0,3.1,2.94);scene.add(sign);
function pine(x,y,z,s=1){for(let j=0;j<7;j++)box(x+j*.08*s,y+j*.45*s,z,.32*s,.49*s,.32*s,C.dark);for(let n=0;n<5;n++){let a=n*2.5,yy=y+(1.8+n*.4)*s,xx=x+Math.cos(a)*.9*s,zz=z+Math.sin(a)*.8*s;beam(x+.3*s,yy-.5*s,z,xx,yy,zz,.17*s,C.wood);for(let i=-3;i<=3;i++)for(let j=-2;j<=2;j++)if(Math.abs(i)+Math.abs(j)<5&&rand()>.12)box(xx+i*.37*s,yy+rand()*.16*s,zz+j*.4*s,.42*s,(.22+rand()*.18)*s,.45*s,choose(['#3e6457','#557b5c','#6d8962','#7e946b']));}}
pine(-6.3,.3,1.2,1.45);pine(6.4,.3,-2.8,1.2);pine(-4.5,.3,-6,1.15);pine(-18,-2.8,-14,1.05);pine(17,-4.7,-20,1.5);
// Rock garden, moss, flowers and trailing vines.
for(let i=0;i<95;i++){let a=rand()*Math.PI*2,r=6+rand()*2.7,x=Math.cos(a)*r,z=Math.sin(a)*r;if(z>5&&Math.abs(x)<2)continue;box(x,.18,z,.25+rand()*.65,.15+rand()*.35,.3+rand()*.6,choose(['#698265','#5a785c','#b8bda5']));if(rand()>.6){box(x,.42,z,.055,.35,.055,'#587257');box(x,.63,z,.16,.12,.16,choose(['#dca58c','#efcc98','#e8d6ba']));}}
for(let i=0;i<25;i++){let a=rand()*6.28,x=Math.cos(a)*8.6,z=Math.sin(a)*8.6;for(let j=0;j<3+rand()*9;j++)box(x+Math.sin(j)*.13,-j*.34,z,.22,.38,.2,choose(['#476e5d','#6b8762']));}
// A small stone lantern and a quiet tea setting.
for(let x of [-2.2,2.2]){box(x,.45,6.6,.55,.25,.55,C.stone);box(x,.85,6.6,.22,.65,.22,C.stone);box(x,1.28,6.6,.45,.38,.45,'#e8c07a');box(x,1.55,6.6,.75,.17,.75,'#70847c');box(x,1.7,6.6,.46,.13,.46,'#87948a');}
box(2.1,1.22,3.4,.9,.16,.65,C.dark);box(2.1,1,3.4,.5,.4,.4,C.wood);box(2.1,1.36,3.4,.17,.13,.17,'#b9c9b4');for(let x of [1.35,2.85])box(x,1,3.4,.45,.32,.45,C.light);
for(const [color,items] of batches){const glow=color==='#f5b656'||color==='#e8c07a';const mat=new THREE.MeshStandardMaterial({color,roughness:.87,emissive:glow?color:'#000000',emissiveIntensity:glow?.5:0});const mesh=new THREE.InstancedMesh(geom,mat,items.length);const obj=new THREE.Object3D();items.forEach((v,i)=>{obj.position.set(v[0],v[1],v[2]);obj.scale.set(v[3],v[4],v[5]);obj.rotation.set(0,v[6],0);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);}
// Broad, quiet voxel cloud banks; a clear opening frames the island's underside.
const clouds=new THREE.Group();scene.add(clouds);const cloudMat=new THREE.MeshStandardMaterial({color:'#eef2e9',roughness:1});
for(let k=0;k<65;k++){let a=rand()*6.28,r=17+rand()*39,cx=Math.cos(a)*r,cz=Math.sin(a)*r;for(let j=0;j<5;j++){let mesh=new THREE.Mesh(geom,cloudMat);mesh.position.set(cx+(rand()-.5)*9,-7+rand()*2,cz+(rand()-.5)*6);mesh.scale.set(3+rand()*6,.5+rand()*1.2,2+rand()*4);clouds.add(mesh);}}
let night=false;const status=document.querySelector('#status');
document.querySelector('#time').onclick=()=>{night=!night;const bg=night?'#263f53':'#cddcdd';scene.background.set(bg);scene.fog.color.set(bg);hemi.intensity=night?1.1:2.6;sun.intensity=night?1:4.3;fill.intensity=night?1.6:1.2;sun.color.set(night?'#bacde8':'#fff0cb');document.body.classList.toggle('night',night);document.querySelector('#time').textContent=night?'☀ 切换晴昼':'☾ 切换薄暮';status.textContent=night?'薄暮 · 灯火可亲':'晴昼 · 云深不知处';};
const auto=document.querySelector('#auto');auto.onclick=()=>{controls.autoRotate=!controls.autoRotate;auto.setAttribute('aria-pressed',String(controls.autoRotate));auto.textContent=controls.autoRotate?'Ⅱ 暂停环绕':'↻ 自动环绕';};
function reset(){controls.target.set(0,4,0);if(innerWidth<600)camera.position.copy(controls.target).add(new THREE.Vector3(35,25,42).multiplyScalar(1.22));else camera.position.set(30,23,35);controls.update();}document.querySelector('#reset').onclick=reset;
renderer.domElement.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Home'].includes(e.key)){e.preventDefault();const delta=camera.position.clone().sub(controls.target);if(e.key==='Home')reset();else if(e.key==='+'||e.key==='-'){delta.multiplyScalar(e.key==='+'?.9:1.1);delta.clampLength(19,76);camera.position.copy(controls.target).add(delta);}else {let sph=new THREE.Spherical().setFromVector3(delta);sph.theta+=e.key==='ArrowLeft'?.12:e.key==='ArrowRight'?-.12:0;sph.phi=THREE.MathUtils.clamp(sph.phi+(e.key==='ArrowUp'?-.08:e.key==='ArrowDown'?.08:0),.22,Math.PI*.49);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph));}controls.update();}});
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(innerWidth<600&&camera.position.distanceTo(controls.target)<60)camera.position.copy(controls.target).add(new THREE.Vector3(35,25,42).multiplyScalar(1.22));}addEventListener('resize',resize);resize();
let last=0;function frame(t){requestAnimationFrame(frame);const dt=Math.min((t-last)/1000,.05);last=t;if(!reduced)clouds.rotation.y+=dt*.002;controls.update(dt);renderer.render(scene,camera);}requestAnimationFrame(frame);
document.querySelector('#loading').remove();document.documentElement.dataset.ready='true';
console.info('云阙 ready', {blocks,three:THREE.REVISION});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='图形上下文中断，请刷新页面恢复';});


