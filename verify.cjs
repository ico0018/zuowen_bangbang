const vm=require('vm'),fs=require('fs'),assert=require('assert');
const events={},nodes={},store={};
const document={getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',focus(){},scrollIntoView(){}}),querySelectorAll:()=>[],addEventListener:(type,fn)=>events[type]=fn};
const ctx=vm.createContext({window:{confirm:()=>true},document,localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}});
for(const file of ['content.js','app.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx);
const click=(dataset={},id='')=>events.click({target:{closest:()=>({dataset,id})}});
const pick=(field,value)=>click({field,value});const next=()=>click({},'next');const read=expr=>vm.runInContext(expr,ctx);
assert(read('C.sample.join("").replace(/[\\s，。：“”！？、；]/g,"").length')>=295);
click({},'begin');next();assert.equal(read('state.step'),0);
pick('person','我的朋友');pick('look','眼睛和笑容');pick('opening','直接介绍这个人');next();assert.equal(read('state.step'),1);
pick('traits','乐于助人');next();assert.equal(read('state.step'),1);
pick('traits','认真负责');pick('traits','幽默开朗');pick('traits','勤奋好学');assert.equal(read('state.traits.length'),3);next();
for(let i=2;i<=4;i++){click({detail:read('state.traits['+(i-2)+']'),value:'一个生活习惯'});next();}
assert.equal(read('state.step'),5);pick('eventTrait','乐于助人');pick('scene','学校里');pick('order','只把好词堆在一起');assert.equal(read('complete(5)'),false);
pick('order','按事情的经过写');events.change({target:{dataset:{check:'eventReady'},checked:true}});next();pick('feeling','感动，心里暖暖的');next();pick('ending','回应开头，表达喜欢');next();assert.equal(read('state.mode'),'write');assert.equal(read('state.done.length'),8);
click({step:'3'});assert.equal(read('state.mode'),'write');assert(nodes.editor.innerHTML.includes('认真负责'));assert(nodes.editor.innerHTML.includes('每次值日'));
click({mode:'prepare'});click({step:'1'});pick('traits','幽默开朗');assert.equal(read('activeSteps().includes(4)'),false);assert.equal(read('state.eventTrait'),'乐于助人');assert(read('state.done.includes(5)')===false);
const saved=JSON.parse(store['xbb-composition-v1']);assert.equal(saved.state.traits.length,2);
console.log('PASS: ~300字范文、未完成阻拦、2—3特点上限、逐步引导、判断题、写作节点回看、素材变更后的进度失效、保存。');
