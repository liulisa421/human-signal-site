(()=>{
const stripBoardTag=s=>String(s||'').replace(/^\s*\[[^\]]+\]\s*/,'').trim();
const partInfo=title=>{const t=stripBoardTag(title);const m=t.match(/^(.{4,80}?)\s*[-–—－]\s*(\d{1,2})(?:\s+|$)/);return m?{base:m[1].trim().toLowerCase(),part:Number(m[2])}:null};
const when=x=>{const n=Date.parse(x?.created_at_source||'');return Number.isFinite(n)?n:0};
function collapseSeries(items){if(!Array.isArray(items)||items.length<2)return items;const groups=new Map();for(const x of items){if(!String(x?.source_id||'').toUpperCase().startsWith('PTT_'))continue;const p=partInfo(x?.title);if(!p)continue;const key=String(x.source_id).toUpperCase()+'|'+p.base;if(!groups.has(key))groups.set(key,{base:p.base,parts:[]});groups.get(key).parts.push(x)}const hidden=new Set();for(const g of groups.values()){if(g.parts.length<2)continue;const source=String(g.parts[0].source_id||'').toUpperCase();const partTimes=g.parts.map(when).filter(Boolean);const anchor=partTimes.length?Math.min(...partTimes):0;const leads=items.filter(x=>{if(String(x?.source_id||'').toUpperCase()!==source||partInfo(x?.title))return false;const t=stripBoardTag(x?.title).toLowerCase();if(!t.startsWith(g.base))return false;const tm=when(x);return !anchor||!tm||Math.abs(tm-anchor)<=7*86400000});const all=[...leads,...g.parts].sort((a,b)=>(when(a)||Number.MAX_SAFE_INTEGER)-(when(b)||Number.MAX_SAFE_INTEGER));const lead=leads.sort((a,b)=>(when(a)||Number.MAX_SAFE_INTEGER)-(when(b)||Number.MAX_SAFE_INTEGER))[0]||all[0];for(const x of all)if(x!==lead)hidden.add(x)}return items.filter(x=>!hidden.has(x))}
if(typeof normalizePayload==='function'){const originalNormalize=normalizePayload;normalizePayload=function(payload){const p={...(payload||{}),items:collapseSeries([...(payload?.items||[])])};return originalNormalize(p)}}
function cleanUnknownAgeBadges(root=document){root.querySelectorAll?.('.tags .tag').forEach(el=>{const s=String(el.textContent||'').trim();if(/^年齡\s+(未知|UNKNOWN|全部|GLOBAL)?$/i.test(s))el.remove()})}
const observer=new MutationObserver(muts=>{for(const m of muts)for(const n of m.addedNodes)if(n.nodeType===1)cleanUnknownAgeBadges(n)});observer.observe(document.documentElement,{childList:true,subtree:true});cleanUnknownAgeBadges();
(async()=>{try{
const r=await fetch('./facet_policy.json',{cache:'no-store'});if(!r.ok)return;
const p=await r.json(),f=p.facets||{},mr=p.market_regions||{};
for(const [id,cfg] of Object.entries(f)){const el=document.getElementById(id);if(!el)continue;const wrap=el.closest('.f');if(wrap)wrap.style.display=cfg.visible===false?'none':''}
const regionEl=document.getElementById('region'),countryEl=document.getElementById('country'),ageEl=document.getElementById('age');
const regionCfg=f.region||{},countryCfg=f.country||{},ageCfg=f.age||{};
const matureRegions=Array.isArray(regionCfg.values)?regionCfg.values:[];
const matureCountries=Array.isArray(countryCfg.values)?countryCfg.values:[];
if(regionEl){const vals=regionCfg.visible?['全世界',...matureRegions]:(matureRegions.length===1?matureRegions:['全世界']);regionEl.innerHTML=vals.map(v=>`<option>${v}</option>`).join('')}
if(typeof updateCountries==='function'&&countryEl){updateCountries=function(){const rv=regionEl?.value||'全世界';const vals=rv==='全世界'?matureCountries:(Array.isArray(mr[rv])?mr[rv]:[]);countryEl.innerHTML='<option>全部</option>'+vals.map(v=>`<option>${v}</option>`).join('')};updateCountries()}
if(ageEl){ageEl.innerHTML='<option>全部</option>'+(ageCfg.visible&&Array.isArray(ageCfg.values)?ageCfg.values.map(v=>`<option>${v}</option>`).join(''):'')}
const clear=document.querySelector('.clear');if(clear&&typeof render==='function'){clear.onclick=()=>{if(typeof q!=='undefined')q.value='';if(regionEl)regionEl.value=regionEl.options[0]?.value||'';if(typeof updateCountries==='function')updateCountries();if(ageEl)ageEl.value='全部';if(typeof period!=='undefined')period.value='近期';render()}}
if(typeof render==='function')render();
}catch(e){console.warn('facet policy unavailable; keeping fail-safe default UI')}})();
})();
;(()=>{
function shorten(root=document){
  root.querySelectorAll?.('.cluster').forEach(el=>{
    if(el.dataset.shortened==='1')return;
    const s=String(el.textContent||'').replace(/\s+/g,' ').trim();
    if(s.length>110)el.textContent=s.slice(0,110).trimEnd()+'…';
    el.dataset.shortened='1';
  });
}
const o=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)shorten(n)});
o.observe(document.documentElement,{childList:true,subtree:true});shorten();
})();
