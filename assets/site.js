// All destinations remain ordinary links without JavaScript.
const dialog=document.querySelector('.enquiry-panel');
let opener;
document.querySelectorAll('[data-enquiry],a.window.contact').forEach(link=>link.addEventListener('click',event=>{
  if(!dialog || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
  event.preventDefault();opener=link;link.classList.add('conversation-open');
  const open=()=>{if(!dialog.open){dialog.showModal();dialog.querySelector('select')?.focus();}};
  if(link.matches('a.window.contact')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)setTimeout(open,560);
  else open();
}));
dialog?.querySelector('.close-panel').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('close',()=>{opener?.classList.remove('conversation-open');opener?.focus({preventScroll:true});});
// Enter through the illustrated opening; native navigation remains the fallback.
document.querySelector('a.window.work')?.addEventListener('click',event=>{
  if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const link=event.currentTarget, svg=link.querySelector('svg');
  if(!svg||!Element.prototype.animate)return;
  event.preventDefault();
  const box=svg.getBoundingClientRect(), portal=document.createElement('div');
  portal.className='window-portal';portal.setAttribute('aria-hidden','true');
  const scene=svg.cloneNode(true);
  // Give cloned SVG references unique IDs while preserving the actual scene.
  scene.querySelectorAll('[id]').forEach(el=>{const old=el.id;el.id='portal-'+old;scene.querySelectorAll('*').forEach(child=>{for(const attr of ['filter','clip-path'])if(child.getAttribute(attr)==='url(#'+old+')')child.setAttribute(attr,'url(#portal-'+old+')');});});
  portal.append(scene);
  Object.assign(portal.style,{left:box.left+box.width*55/240+'px',top:box.top+box.height*83/300+'px',width:box.width*130/240+'px',height:box.height*166/300+'px'});
  document.body.append(portal);
  const motion=portal.animate([{opacity:1},{left:'0px',top:'0px',width:'100vw',height:'100dvh',opacity:1,boxShadow:'0 0 0 100vmax #e8dfcf'}],{duration:650,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
  let leaving=false;const leave=()=>{if(leaving)return;leaving=true;location.assign(link.href);};
  motion.finished.then(leave,leave);setTimeout(leave,850);
});
addEventListener('pageshow',()=>document.querySelectorAll('.window-portal').forEach(p=>p.remove()));
const draftKey='stucco-enquiry-draft-v1';
for(const form of document.querySelectorAll('[data-enquiry-form]')){
  const fields=['projectType','service','description','location','name','email','phone'];
  try{const saved=JSON.parse(sessionStorage.getItem(draftKey)||'{}');for(const key of fields)if(typeof saved[key]==='string')form.elements[key].value=saved[key];}catch{}
  const read=()=>Object.fromEntries(fields.map(key=>[key,form.elements[key].value]));
  form.addEventListener('input',()=>{try{sessionStorage.setItem(draftKey,JSON.stringify(read()));}catch{}form.querySelector('.draft-result').hidden=true;});
  let draftText='';
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=read();
    draftText=`Hello Stucco Stories,\n\nProject type: ${data.projectType}\nService: ${data.service}\nLocation: ${data.location}\n\n${data.description}\n\nName: ${data.name}\nEmail: ${data.email}${data.phone?'\nPhone: '+data.phone:''}`;
    const link=form.querySelector('.draft-link');
    link.href=`mailto:stuccostories@gmail.com?subject=${encodeURIComponent(data.projectType+' enquiry — '+data.location)}&body=${encodeURIComponent(draftText)}`;
    form.querySelector('.draft-result').hidden=false;link.focus();
  });
  form.querySelector('.copy-draft').addEventListener('click',async()=>{
    const status=form.querySelector('.copy-status');
    try{await navigator.clipboard.writeText(draftText);status.textContent='Copied. Paste the enquiry into an email to stuccostories@gmail.com.';}
    catch{status.textContent='Clipboard access is unavailable. Use “Open in your email app” to open the prepared draft.';}
  });
}
const chapterLinks=[...document.querySelectorAll('[data-chapter]')];
const projects=[...document.querySelectorAll('[data-group]')];
function selectChapter(key,updateUrl=false){
  if(!chapterLinks.some(a=>a.dataset.chapter===key))return;
  chapterLinks.forEach(a=>{const active=a.dataset.chapter===key;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  projects.forEach(p=>p.hidden=key!=='all'&&p.dataset.group!==key);
  document.querySelector('.architectural-index')?.classList.toggle('filtered',key!=='all');
  document.querySelectorAll('[data-description]').forEach(s=>s.hidden=key!=='all'&&s.dataset.description!==key);
  const status=document.querySelector('.filter-status');if(status)status.textContent=`${projects.filter(p=>!p.hidden).length} projects shown.`;
  if(updateUrl)history.pushState(null,'',key==='all'?'#project-index':'#chapter-'+key);
}
chapterLinks.forEach(a=>a.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey)return;event.preventDefault();selectChapter(a.dataset.chapter,true);}));
const fromHash=()=>selectChapter(location.hash.startsWith('#chapter-')?location.hash.slice(9):'all');
if(chapterLinks.length){fromHash();addEventListener('popstate',fromHash);}
