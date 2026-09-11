(()=>{(async()=>{try{const r=await fetch('./facet_policy.json',{cache:'no-store'});if(!r.ok)return;const p=await r.json(),f=p.facets||{},mr=p.market_regions||{};for(const [id,cfg] of Object.entries(f)){const el=document.getElementById(id);if(!el)continue;const wrap=el.closest('.f');if(wrap)wrap.style.display=cfg.visible===false?'none':''}const regionEl=document.getElementById('region'),countryEl=document.getElementById('country'),ageEl=document.getElementById('age');const regionCfg=f.region||{},countryCfg=f.country||{},ageCfg=f.age||{};const matureRegions=Array.isArray(regionCfg.values)?regionCfg.values:[];const matureCountries=Array.isArray(countryCfg.values)?countryCfg.values:[];if(regionEl){const vals=regionCfg.visible?['全世界',...matureRegions]:(matureRegions.length===1?matureRegions:['全世界']);regionEl.innerHTML=vals.map(v=>`<option>${v}</option>`).join('')}if(countryEl){const update=()=>{const rv=regionEl?.value||'全世界';const vals=rv==='全世界'?matureCountries:(Array.isArray(mr[rv])?mr[rv]:[]);countryEl.innerHTML='<option>全部</option>'+vals.map(v=>`<option>${v}</option>`).join('')};regionEl?.addEventListener('change',update);update()}if(ageEl){ageEl.innerHTML='<option>全部</option>'+(ageCfg.visible&&Array.isArray(ageCfg.values)?ageCfg.values.map(v=>`<option>${v}</option>`).join(''):'')}if(typeof render==='function')render()}catch(e){console.warn('facet policy unavailable; keeping fail-safe default UI')}})();})();;(()=>{
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
