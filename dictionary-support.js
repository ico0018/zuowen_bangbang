'use strict';
(()=>{
 const P=window.pinyinPro,D=window.CompositionDictionary,root=document.querySelector('main');if(!P||!D||!root)return;
 const toolbar=document.createElement('div');toolbar.className='dictionary-toolbar';toolbar.dataset.noLookup='';toolbar.innerHTML='<p>📖 不会的字，用鼠标拖选；手机长按选中文字，就能查读音和意思。</p><label>查一个字<input id="lookup-input" maxlength="1" placeholder="输入汉字" aria-label="要查的汉字"></label><button type="button" class="secondary" id="lookup-search">查询</button>';
 root.querySelector('.topbar').insertAdjacentElement('afterend',toolbar);
 const bubble=document.createElement('section');bubble.className='dictionary-bubble';bubble.hidden=true;bubble.setAttribute('role','dialog');bubble.setAttribute('aria-label','小字典');bubble.dataset.noLookup='';document.body.appendChild(bubble);
 let anchor=null,scheduled=false,selectionTimer=null,lastSelection="",selectionRect=null;const wordKeys=Object.keys(D.words).sort((a,b)=>b.length-a.length);
 function decorate(){observer.disconnect();const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return /[\u3400-\u9fff]/.test(node.nodeValue)&&!node.parentElement.closest('[data-no-lookup],.lookup-text,.lookup-char,script,style,textarea,select,option')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});const pending=[];while(walker.nextNode())pending.push(walker.currentNode);pending.forEach(node=>{const text=node.nodeValue,span=document.createElement('span');span.className='lookup-text';let offset=0;const parts=P.pinyin(text,{type:'all',segmentit:2});parts.forEach(part=>{if(!part.isZh)span.appendChild(document.createTextNode(part.origin));else{const char=document.createElement('span');char.className='lookup-char';char.textContent=part.origin;char.dataset.char=part.origin;char.dataset.pinyin=part.pinyin;
 const hit=wordKeys.find(word=>{const start=text.lastIndexOf(word,offset);return start>=0&&start<=offset&&start+word.length>offset;});if(hit)char.dataset.word=hit;
 span.appendChild(char);}offset+=part.origin.length;});node.replaceWith(span);});observer.observe(root,{subtree:true,childList:true,characterData:true});}
 const observer=new MutationObserver(()=>{if(!bubble.hidden&&anchor&&!anchor.isConnected)close(false);if(scheduled)return;scheduled=true;Promise.resolve().then(()=>{scheduled=false;decorate();});});
 function close(focus=true){bubble.hidden=true;if(anchor){anchor.classList.remove('lookup-selected');if(focus&&anchor.matches('button,input'))anchor.focus({preventScroll:true});}anchor=null;selectionRect=null;}
 function place(){if(bubble.hidden)return;const width=Math.min(360,window.innerWidth-24);bubble.style.width=width+'px';const r=selectionRect||(anchor?anchor.getBoundingClientRect():toolbar.getBoundingClientRect()),height=bubble.getBoundingClientRect().height;const top=r.bottom+10+height<window.innerHeight?r.bottom+10:Math.max(12,r.top-height-10);bubble.style.left=Math.max(12,Math.min(window.innerWidth-width-12,r.left-20))+'px';bubble.style.top=Math.max(12,Math.min(window.innerHeight-height-12,top))+'px';}
 function show(char,pinyin,word,target,rect){close(false);selectionRect=rect||null;anchor=target;if(anchor.classList.contains('lookup-char'))anchor.classList.add('lookup-selected');bubble.replaceChildren();
 const head=document.createElement('div');head.className='dictionary-head';const glyph=document.createElement('strong');glyph.textContent=char;const sound=document.createElement('span');sound.textContent=pinyin||P.pinyin(char);head.append(glyph,sound);const quit=document.createElement('button');quit.type='button';quit.textContent='×';quit.setAttribute('aria-label','关闭小字典');quit.addEventListener('click',()=>close());head.appendChild(quit);bubble.appendChild(head);
 const caption=document.createElement('small');caption.textContent=target.tagName==='INPUT'?'单字读音；多音字还要结合所在词语判断':'上方读音按你选中的句子识别';bubble.appendChild(caption);
 function block(label,text){const h=document.createElement('h4');h.textContent=label;const p=document.createElement('p');p.textContent=text;bubble.append(h,p);}
 if(word&&D.words[word])block(word+' · '+P.pinyin(word,{segmentit:2}),D.words[word]);
 const meaning=D.chars[char]&&D.chars[char].meaning||'这个字的释义暂未收录，可以请老师或家人帮助查纸质字典。';block('这个字的常见意思',meaning.length>110?meaning.slice(0,110)+'…':meaning);
 if(meaning.length>110){const details=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent='展开更多字义';p.textContent=meaning;details.append(summary,p);bubble.appendChild(details);details.addEventListener('toggle',place);}
 const readings=P.polyphonic(char,{type:'array'})[0]||[],all=readings.join('、');if(readings.length>1){const details=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent='还有其他读音';p.textContent=all+'。不同词语里读音和意思可能不同。';details.append(summary,p);bubble.appendChild(details);details.addEventListener('toggle',place);}
 bubble.hidden=false;place();}
 function inspectSelection(){
 const selection=window.getSelection();if(!selection||selection.isCollapsed||!selection.rangeCount){lastSelection='';return;}
 const range=selection.getRangeAt(0),start=range.startContainer.nodeType===3?range.startContainer.parentElement:range.startContainer,end=range.endContainer.nodeType===3?range.endContainer.parentElement:range.endContainer;
 if(!root.contains(start)||!root.contains(end)||start.closest('[data-no-lookup],input,textarea')||end.closest('[data-no-lookup],input,textarea'))return;
 const selected=selection.toString().trim();if(!selected||selected.length>12)return;
 const chars=Array.from(root.querySelectorAll('.lookup-char')).filter(el=>range.intersectsNode(el));const target=chars.find(el=>selected.includes(el.dataset.char));if(!target)return;
 const key=selected+'|'+target.dataset.pinyin+'|'+target.closest('.lookup-text').textContent;if(key===lastSelection)return;lastSelection=key;
 show(target.dataset.char,target.dataset.pinyin,D.words[selected]?selected:target.dataset.word,target,range.getBoundingClientRect());
 }
 document.addEventListener('selectionchange',()=>{clearTimeout(selectionTimer);selectionTimer=setTimeout(inspectSelection,350);});
 document.addEventListener('mouseup',()=>{clearTimeout(selectionTimer);selectionTimer=setTimeout(inspectSelection,0);});
 document.addEventListener('click',e=>{if(bubble.contains(e.target))return;const selection=window.getSelection();if(selection&&!selection.isCollapsed&&root.contains(e.target)&&selection.anchorNode&&e.target.contains(selection.anchorNode)){if(e.target.closest('button,a,label,summary')){e.preventDefault();e.stopImmediatePropagation();}return;}if(e.target.id!=='lookup-search')close(false);},true);
 function search(){const input=toolbar.querySelector('#lookup-input'),char=input.value.trim();if(!/^[\u3400-\u9fff]$/.test(char)){input.setCustomValidity('请输入一个汉字');input.reportValidity();return;}input.setCustomValidity('');show(char,P.pinyin(char),null,input);}
 toolbar.querySelector('#lookup-search').addEventListener('click',search);toolbar.querySelector('#lookup-input').addEventListener('keydown',e=>{if(e.key==='Enter')search();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});window.addEventListener('resize',place);window.addEventListener('scroll',e=>{if(!bubble.contains(e.target))close(false);},true);decorate();
})();
