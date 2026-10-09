'use strict';
(()=>{
 const params=new URLSearchParams(location.search),match=window.CompositionCatalog.findLesson(params.get('lesson'));
 if(!match||!match.item.training){location.replace('index.html');return;}
 const {book,item}=match,C=window.CompositionContent;
 window.CompositionStateKey='xbb-composition-v1:'+item.id;
 if(item.title==='身边那些有特点的人'){try{if(!localStorage.getItem(window.CompositionStateKey)){const old=localStorage.getItem('xbb-composition-v1');if(old)localStorage.setItem(window.CompositionStateKey,old);}}catch(e){}}
 C.sampleTitle=item.title==='猜猜他是谁'?'猜猜她是谁':'我的好朋友';
 const $=id=>document.getElementById(id);
 $('back-catalog').href=`index.html?grade=${book.grade}&semester=${book.semester}&edition=${book.edition}&lesson=${item.id}`;
 $('topic-title').textContent=item.title;$('topic-context').textContent=`${book.name} · 第${item.unit}单元 · ${book.edition==='revised'?'修订版':'原版'}`;$('topic-goal').textContent=item.goal;
 if(item.title==='猜猜他是谁'){
 C.guess=true;
 C.steps[0].hint='选择班里的一位同学。抓住外貌或动作的特点，开头也不要出现姓名。';C.steps[0].example='我想请你猜一位同学。她有一双明亮的眼睛，笑起来像两弯小月牙。课间，她常常和我一起读书。';
 C.steps[7].hint='结尾继续把姓名藏起来，邀请大家根据特点猜一猜。';C.steps[7].example='她就是这样一个热心又认真的女孩。你能根据这些小线索，猜出她是谁吗？';
 C.steps.forEach(s=>{s.example=s.example.replace(/小雨/g,'她');});
 C.sample=C.sample.map(p=>p.replace(/小雨/g,'她'));C.sample[0]=C.steps[0].example;C.sample[C.sample.length-1]='她就是这样一个热心又认真的女孩。我也想像她一样，把关心送给身边的人。你能根据这些线索猜出她是谁吗？';
 }
})();
