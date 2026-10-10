'use strict';
window.CompositionMap=(()=>{
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function html(config){const nodes=config.nodes,person=config.person,letter=config.kind==='letter',poem=config.kind==='poem';
 const groups=person?[nodes.filter(n=>n.id===0),nodes.filter(n=>n.id>=2&&n.id<=5),nodes.filter(n=>n.id>=6)]:letter?[nodes.slice(0,1),nodes.slice(1,3),nodes.slice(3)]:[nodes.slice(0,1),nodes.slice(1,-1),nodes.slice(-1)];
 const labels=config.labels||(poem?['选主题','写画面','编排分享']:letter?['称呼和问候','想说的话','祝福和落款']:['开头 · 带读者进来','中间 · 展开写具体','收尾 · 完整落笔']);
 const card=n=>`<button class="map-leaf ${n.active?'active ':''}${n.done?'done ':''}${n.key?'key-leaf':''}" ${config.attribute}="${n.id}" ${n.active?'aria-current="step"':''}><span class="leaf-heading"><span class="leaf-number">${n.order}</span><strong>${esc(n.label)}</strong>${n.key?'<span class="key-label">重点</span>':''}</span><small>${esc(n.budget)}</small><span class="leaf-material">${esc(n.material||'✎ 还没有记素材，点这里补一补')}</span>${n.parts?`<span class="leaf-parts">${n.parts.map(s=>`<span>${esc(s)}</span>`).join('<i aria-hidden="true">→</i>')}</span>`:''}<span class="leaf-status">${n.done?'✓ 素材已准备':'○ 待准备'}</span></button>`;
 return `<div class="visual-map"><div class="map-center"><span aria-hidden="true">✎</span><strong>${esc(config.title)}</strong><small>${poem?'让画面和感受连起来':'我的整篇作文 · 约300字'}</small></div><p class="map-caption">先看整棵树，再沿着分支写。点击任一内容卡，回看提示和范例。</p><div class="map-groups">${groups.map((group,i)=>`<section class="map-branch branch-${i}"><h3><span aria-hidden="true">${['🌱','🌿','🌼'][i]}</span>${labels[i]}</h3>${person&&i===1?'<button class="map-adjust" data-step="1">2—3个人物特点 · 点此调整</button>':''}<div class="branch-leaves">${group.map(card).join('')}</div></section>`).join('')}</div><div class="map-legend"><span>①②③ 是写作顺序</span><span>★ 重点内容，多写几个具体细节</span><span>✓ 表示已记好素材，作文仍在纸上写</span></div></div>`;
 }
 function show(config){const map=document.getElementById('mindmap'),writing=config.mode==='write';map.closest('.workspace').classList.toggle('writing-workspace',writing);map.closest('aside').classList.toggle('visual-map-panel',writing);if(writing){map.classList.remove('tree');map.innerHTML=html(config);}else map.classList.add('tree');}
 return {html,show};
})();
