(()=>{
const stripBoardTag=s=>String(s||'').replace(/^\s*\[[^\]]+\]\s*/,'').trim();
const seriesBase=title=>stripBoardTag(title).replace(/\s*[-–—－]\s*\d{1,2}(?:\s+.*)?$/,'').trim().toLowerCase();
const numbered=title=>/\s*[-–—－]\s*\d{1,2}(?:\s+|$)/.test(stripBoardTag(title));
let busy=false;
function cleanCards(){
  if(busy)return; busy=true;
  try{
    document.querySelectorAll('.tags .tag').forEach(el=>{
      const s=String(el.textContent||'').trim();
      if(/^年齡\s+(未知|UNKNOWN|全部|GLOBAL)?$/i.test(s))el.remove();
    });
    document.querySelectorAll('.cluster').forEach(el=>{
      if(el.dataset.shortened==='1')return;
      const s=String(el.textContent||'').replace(/\s+/g,' ').trim();
      if(s.length>110)el.textContent=s.slice(0,110).trimEnd()+'…';
      el.dataset.shortened='1';
    });
    const cards=[...document.querySelectorAll('#grid .card')];
    const groups=new Map();
    for(const card of cards){
      const h=card.querySelector('h3'); if(!h)continue;
      const title=String(h.textContent||'').trim();
      const base=seriesBase(title); if(!base)continue;
      if(!groups.has(base))groups.set(base,[]);
      groups.get(base).push({card,title});
    }
    for(const rows of groups.values()){
      if(rows.length<2)continue;
      const seriesRows=rows.filter(x=>numbered(x.title));
      if(seriesRows.length<2)continue;
      const lead=rows.find(x=>!numbered(x.title))||rows[0];
      for(const row of rows){if(row!==lead)row.card.remove();}
    }
  } finally {busy=false;}
}
const observer=new MutationObserver(()=>cleanCards());
observer.observe(document.documentElement,{childList:true,subtree:true});
cleanCards();
})();
