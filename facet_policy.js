(()=>{
const TOPIC_ZH={
'Dating & Relationships':'感情／關係','Friendship & Social Hurt':'朋友／人際','Work & Career':'工作／職涯','Family & Parenting':'家庭／育兒','Money & Financial Stress':'金錢／財務','Housing & Living':'居住／生活','Health & Wellbeing':'健康／身心','Education & Learning':'學習／教育','Loneliness & Belonging':'孤獨／歸屬','Self Growth & Identity':'自我／成長'};
const stripBoardTag=s=>String(s||'').replace(/^\s*\[[^\]]+\]\s*/,'').trim();
const seriesBase=title=>stripBoardTag(title).replace(/\s*[-–—－]\s*\d{1,2}(?:\s+.*)?$/,'').trim().toLowerCase();
const numbered=title=>/\s*[-–—－]\s*\d{1,2}(?:\s+|$)/.test(stripBoardTag(title));
let busy=false;
function cleanUI(){if(busy)return;busy=true;try{
 const age=document.getElementById('age');if(age){const wrap=age.closest('.f');if(wrap)wrap.style.display='none';age.value='全部';}
 document.querySelectorAll('.tags').forEach(tags=>{[...tags.querySelectorAll('.tag')].forEach((el,i)=>{const s=String(el.textContent||'').trim();if(/^年齡(?:\s|$)/i.test(s)){el.remove();return;}if(/PTT_|REDDIT_|D_CARD|DCARD|FACEBOOK|INSTAGRAM|THREADS|YOUTUBE/i.test(s)||/・/.test(s)){el.remove();return;}if(TOPIC_ZH[s])el.textContent=TOPIC_ZH[s];else if(i===0&&/[A-Za-z]/.test(s)&&!/[\u4e00-\u9fff]/.test(s))el.remove();});if(!tags.children.length)tags.remove();});
 document.querySelectorAll('.cluster').forEach(el=>{if(el.dataset.shortened==='1')return;const s=String(el.textContent||'').replace(/\s+/g,' ').trim();if(s.length>110)el.textContent=s.slice(0,110).trimEnd()+'…';el.dataset.shortened='1';});
 const cards=[...document.querySelectorAll('#grid .card')],groups=new Map();for(const card of cards){const h=card.querySelector('h3');if(!h)continue;const title=String(h.textContent||'').trim(),base=seriesBase(title);if(!base)continue;if(!groups.has(base))groups.set(base,[]);groups.get(base).push({card,title});}for(const rows of groups.values()){if(rows.length<2)continue;const seriesRows=rows.filter(x=>numbered(x.title));if(seriesRows.length<2)continue;const lead=rows.find(x=>!numbered(x.title))||rows[0];for(const row of rows)if(row!==lead)row.card.remove();}
}finally{busy=false;}}
const observer=new MutationObserver(()=>cleanUI());observer.observe(document.documentElement,{childList:true,subtree:true});cleanUI();
})();
