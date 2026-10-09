'use strict';
// Reading aid only: original strings, answer values and saved materials stay Chinese.
(()=>{
 if(!window.pinyinPro||!window.pinyinPro.pinyin)return;
 const root=document.querySelector('main');if(!root)return;
 const pref='xbb-composition-pinyin-v1',originalOptions=new WeakMap();let enabled=true,scheduled=false;
 try{enabled=localStorage.getItem(pref)!=='off';}catch(e){}
 const toolbar=document.createElement('div');toolbar.className='pinyin-toolbar';toolbar.setAttribute('data-no-pinyin','');
 const toggle=document.createElement('button');toggle.id='pinyin-toggle';toggle.type='button';toggle.className='secondary';
 toolbar.appendChild(toggle);root.querySelector('.topbar').insertAdjacentElement('afterend',toolbar);
 function thirdGrade(){const p=new URLSearchParams(location.search),lesson=p.get('lesson');if(lesson){const hit=window.CompositionCatalog.findLesson(lesson);return !!hit&&hit.book.grade===3;}return p.get('grade')!=='4';}
 function annotate(text){const fragment=document.createDocumentFragment();window.pinyinPro.pinyin(text,{type:'all',toneType:'symbol',segmentit:2}).forEach(part=>{
 if(!part.isZh){fragment.appendChild(document.createTextNode(part.origin));return;}
 const ruby=document.createElement('ruby');ruby.className='reading-ruby';ruby.appendChild(document.createTextNode(part.origin));
 const rt=document.createElement('rt');rt.textContent=part.pinyin;rt.setAttribute('aria-hidden','true');ruby.appendChild(rt);fragment.appendChild(ruby);
 });return fragment;}
 function apply(){observer.disconnect();const third=thirdGrade(),show=third&&enabled;toolbar.hidden=!third;root.classList.toggle('with-pinyin',show);
 toggle.textContent='';toggle.appendChild(annotate(enabled?'拼音：开 · 点此收起':'拼音：关 · 点此显示'));toggle.setAttribute('aria-pressed',String(enabled));toggle.setAttribute('aria-label',enabled?'收起拼音':'显示拼音');
 if(!show){root.querySelectorAll('ruby.reading-ruby').forEach(r=>r.replaceWith(document.createTextNode(r.firstChild.textContent)));root.querySelectorAll('.pinyin-text').forEach(s=>s.replaceWith(...s.childNodes));root.normalize();}
 else{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!/[\u3400-\u9fff]/.test(node.nodeValue)||node.parentElement.closest('ruby,rt,script,style,textarea,select,option,[data-no-pinyin]'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});const pending=[];while(walker.nextNode())pending.push(walker.currentNode);pending.forEach(node=>{const span=document.createElement('span');span.className='pinyin-text';span.appendChild(annotate(node.nodeValue));node.replaceWith(span);});}
 // Native option menus cannot render ruby; show inline pronunciation instead.
 root.querySelectorAll('select option').forEach(o=>{if(!originalOptions.has(o))originalOptions.set(o,o.textContent);const text=originalOptions.get(o);o.textContent=show?text+' · '+window.pinyinPro.pinyin(text,{toneType:'symbol'}):text;});
 observer.observe(root,{childList:true,subtree:true,characterData:true});}
 const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;Promise.resolve().then(()=>{scheduled=false;apply();});});
 toggle.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem(pref,enabled?'on':'off');}catch(e){}apply();});apply();
})();
