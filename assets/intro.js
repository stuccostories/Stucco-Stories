// Show once per browsing session; returning from a project goes straight to the windows.
(()=>{
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const replay=new URLSearchParams(location.search).get('intro')==='1';
 try{if(!replay&&sessionStorage.getItem('stucco-welcome-motion-v4'))return;sessionStorage.setItem('stucco-welcome-motion-v4','1');}catch{}
 document.documentElement.classList.add('studio-entering');
 const reveal=()=>{document.documentElement.classList.remove('studio-entering');document.querySelector('.studio-intro')?.remove();};
 setTimeout(()=>document.documentElement.classList.add('studio-revealing'),2450);
 setTimeout(reveal,3850);
 setTimeout(()=>document.documentElement.classList.remove('studio-revealing'),4500);
 addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='Tab')reveal();},{once:true});
 addEventListener('pageshow',e=>{if(e.persisted)reveal();});
})();
