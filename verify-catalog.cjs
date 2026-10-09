const fs=require('fs'),vm=require('vm'),assert=require('assert');
const load=(ctx,f)=>vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx);
const events={},nodes={},store={};const document={getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',focus(){},scrollIntoView(){}}),querySelectorAll:()=>[],addEventListener:(type,fn)=>{events[type]=fn;}};document.getElementById('edition').addEventListener=(t,fn)=>events.edition=fn;
const ctx=vm.createContext({window:{},document,URLSearchParams,location:{search:''},history:{replaceState(){}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
load(ctx,'catalog.js');load(ctx,'catalog-app.js');
const catalog=ctx.window.CompositionCatalog;
assert.equal(catalog.books.length,6);const ids=catalog.books.reduce((all,b)=>all.concat(b.items.map(i=>i.id)),[]);assert.equal(new Set(ids).size,48);
assert(nodes['catalog-list'].innerHTML.includes('那次经历真难忘'));assert(nodes['catalog-list'].innerHTML.indexOf('续写故事')<nodes['catalog-list'].innerHTML.indexOf('我来编童话'));
const click=dataset=>events.click({target:{closest:()=>({dataset})}});click({grade:'4'});assert(nodes['catalog-list'].innerHTML.includes('中国的世界文化遗产'));assert(!nodes['catalog-list'].innerHTML.includes('记一次游戏'));click({semester:'lower'});assert(nodes['catalog-list'].innerHTML.includes('修订版下册还未核对完成'));
events.click({target:{closest:()=>({dataset:{},id:'use-original'})}});assert(nodes['catalog-list'].innerHTML.includes('我的动物朋友'));assert(nodes['catalog-list'].innerHTML.includes('轻叩诗歌大门'));assert.equal(nodes['book-note'].textContent,'原版 · 7次习作 + 1项综合性学习 · 按单元顺序');
click({lesson:'original-4-lower-7'});assert(nodes['lesson-detail'].innerHTML.includes('外貌特点'));assert(nodes['lesson-detail'].innerHTML.includes('分步引导还在整理中'));assert(!nodes['lesson-detail'].innerHTML.includes('trainer.html'));
function topic(lesson){const n={},w={};const d={getElementById:id=>n[id]||(n[id]={})};const c=vm.createContext({window:w,URLSearchParams,document:d,location:{search:'?lesson='+lesson,replace(){}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});load(c,'catalog.js');load(c,'content.js');load(c,'topic-setup.js');return w;}
store['xbb-composition-v1']=JSON.stringify({version:1,state:{person:'旧素材'}});
const guess=topic('revised-3-upper-1');assert(guess.CompositionContent.guess);assert(!JSON.stringify(guess.CompositionContent.steps).includes('小雨'));assert(!JSON.stringify(guess.CompositionContent.sample).includes('小雨'));assert(!store[guess.CompositionStateKey]);
const person=topic('original-3-lower-6');assert.notEqual(person.CompositionStateKey,guess.CompositionStateKey);assert(store[person.CompositionStateKey]);
console.log('PASS: 年级册次切换、48个唯一课题位置、修订版顺序、综合性学习区分、未核对提示、不同课题框架、猜人物不揭晓姓名、记录隔离与旧稿迁移。');
