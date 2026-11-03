const C='rates-v8';
const F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./cairo-arabic-700-normal.woff2','./cairo-arabic-900-normal.woff2','./cairo-latin-700-normal.woff2','./cairo-latin-900-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
const r=e.request;if(r.method!=='GET')return;
const isPage=r.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(new URL(r.url).pathname);
if(isPage){
// Network first for the page, so updates arrive as soon as you're online; cached copy when offline.
e.respondWith(fetch(new Request(r.url,{cache:'no-store'})).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));
return;}
e.respondWith(caches.match(r,{ignoreSearch:true}).then(x=>x||fetch(r)));
});
