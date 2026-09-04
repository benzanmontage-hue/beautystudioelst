/* Selé Beauty Studio — AI Chatbot Widget (zelfstandig, injecteert CSS+HTML+logica) */
(function(){
  if (window.__seleChatLoaded) return; window.__seleChatLoaded = true;

  const BOOK_URL = 'https://selinaco4l.setmore.com/';

  var css = `
#seleChatBubble{position:fixed;bottom:24px;right:24px;width:68px;height:68px;border-radius:50%;background:#b57f69;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(181,127,105,.4);transition:transform .25s;z-index:999;font-size:30px}
#seleChatBubble:hover{transform:scale(1.08)}
#seleChatWindow{position:fixed;bottom:96px;right:24px;width:min(380px,calc(100vw - 40px));height:560px;max-height:calc(100vh - 120px);background:#fff;border-radius:20px;box-shadow:0 24px 70px rgba(58,44,36,.25);display:flex;flex-direction:column;overflow:hidden;z-index:1000;transform-origin:bottom right;transition:transform .28s cubic-bezier(.22,1,.36,1),opacity .28s;opacity:0;transform:scale(.9) translateY(20px);pointer-events:none;font-family:'Inter',sans-serif}
#seleChatWindow.open{opacity:1;transform:scale(1) translateY(0);pointer-events:auto}
.sele-head{background:#3a2c24;color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px}
.sele-head .avatar{width:42px;height:42px;border-radius:50%;background:#b57f69;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-style:italic;font-size:1.2rem;flex-shrink:0}
.sele-head .meta{flex:1}.sele-head .meta b{font-family:'Playfair Display',serif;font-size:1rem;display:block}
.sele-head .meta span{font-size:.74rem;opacity:.7;display:flex;align-items:center;gap:5px}
.sele-head .meta .dot{width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block}
.sele-head .close{background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;opacity:.7;line-height:1}
.sele-body{flex:1;overflow-y:auto;padding:18px;background:#faf5ee;display:flex;flex-direction:column;gap:12px}
.sele-msg{max-width:82%;padding:11px 15px;border-radius:16px;font-size:.9rem;line-height:1.5;color:#3a2c24;animation:seleFade .3s ease}
.sele-msg.bot{background:#fff;border:1px solid rgba(58,44,36,.1);align-self:flex-start;border-bottom-left-radius:4px}
.sele-msg.user{background:#b57f69;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.sele-msg .pl{margin-top:8px;width:100%;border-collapse:collapse;font-size:.82rem}
.sele-msg .pl td{padding:5px 0;border-bottom:1px solid rgba(58,44,36,.1)}
.sele-msg .pl td:last-child{text-align:right;font-weight:600;color:#9a6751}
.sele-msg .pl tr:last-child td{border-bottom:none}
@keyframes seleFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.sele-typing{display:flex;gap:4px;padding:12px 15px;background:#fff;border:1px solid rgba(58,44,36,.1);border-radius:16px;align-self:flex-start;border-bottom-left-radius:4px}
.sele-typing span{width:7px;height:7px;border-radius:50%;background:#8d7b6f;animation:seleBlink 1.2s infinite}
.sele-typing span:nth-child(2){animation-delay:.2s}.sele-typing span:nth-child(3){animation-delay:.4s}
@keyframes seleBlink{0%,60%,100%{opacity:.3}30%{opacity:1}}
.sele-quick{display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 12px;background:#faf5ee}
.sele-quick button{background:#fff;border:1px solid #b57f69;color:#9a6751;font-size:.8rem;font-weight:500;padding:8px 14px;border-radius:100px;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif}
.sele-quick button:hover{background:#b57f69;color:#fff}
.sele-foot{display:flex;gap:8px;padding:12px;background:#fff;border-top:1px solid rgba(58,44,36,.1)}
.sele-foot input{flex:1;border:1px solid rgba(58,44,36,.1);border-radius:100px;padding:11px 16px;font-size:.9rem;font-family:'Inter',sans-serif;outline:none;background:#faf5ee;color:#3a2c24}
.sele-foot input:focus{border-color:#b57f69}
.sele-foot button{background:#b57f69;color:#fff;border:none;width:44px;height:44px;border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px}
.sele-book{display:inline-block;background:#b57f69;color:#fff!important;font-size:.85rem;font-weight:600;padding:11px 22px;border-radius:100px;margin-top:8px;text-decoration:none;letter-spacing:.5px}
`;

  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var html = '<button id="seleChatBubble" aria-label="Chat">💬</button>' +
  '<div id="seleChatWindow"><div class="sele-head"><div class="avatar">S</div><div class="meta"><b>Selé Assistant</b><span><span class="dot"></span> Online · antwoordt direct</span></div><button class="close" id="seleChatClose">×</button></div>' +
  '<div class="sele-body" id="seleChatBody"></div><div class="sele-quick" id="seleQuick"></div>' +
  '<div class="sele-foot"><input type="text" id="seleChatInput" placeholder="Stel je vraag…"><button id="seleChatSend" aria-label="Verstuur">➤</button></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);

  var KB = [
    {k:['hoi','hallo','hey','goedendag','hi'], r:'Hoi! 👋 Welkom bij Selé Beauty Studio. Ik kan je alles vertellen over onze behandelingen, prijzen en openingstijden. Waar kan ik je mee helpen?'},
    {k:['prijs','prijzen','kosten','tarief','tarieven','duur','hoe duur','euro','€'], r:'Dit zijn onze prijzen:<table class="pl"><tr><td>Botox Glow (keratine)</td><td>vanaf €90</td></tr><tr><td>Marrocare Smooth</td><td>vanaf €150</td></tr><tr><td>Permanent Straight</td><td>vanaf €220</td></tr><tr><td>Classic Blowout</td><td>€40</td></tr><tr><td>Bombshell Blowout</td><td>€55</td></tr><tr><td>Sleek Blowout</td><td>€45</td></tr><tr><td>Brow Shape</td><td>€20+</td></tr><tr><td>Brow Signature</td><td>€35–40</td></tr><tr><td>Brow Luxe</td><td>€57,50</td></tr></table>'},
    {k:['keratine','smoothing','botox','marrocare','permanent','steil'], r:'💇‍♀️ <b>Keratine:</b><br>• <b>Botox Glow (vanaf €90)</b> — zacht & pluisvrij, ±3–4 maanden<br>• <b>Marrocare Smooth (vanaf €150)</b> — tot 80% rechter, ±6 maanden<br>• <b>Permanent Straight (vanaf €220)</b> — permanent steil'},
    {k:['blowout','fohn','föhn','volume','krullen'], r:'💨 <b>Blowouts:</b><br>• <b>Classic (€40, 45 min)</b> — volumineus, everyday glam<br>• <b>Bombshell (€55, 60 min)</b> — max volume, "big hair"<br>• <b>Sleek (€45)</b> — strak & gepolijst'},
    {k:['wenkbrauw','wenkbrauwen','brow','brows','epileren','henna','lamination'], r:'👁️ <b>Wenkbrauwen:</b><br>• <b>Brow Shape (€20+)</b> — epileren & trimmen<br>• <b>Brow Signature (€35–40)</b> — shaping + henna/hybrid<br>• <b>Brow Luxe (€57,50)</b> — lamination + hybrid tint of henna + shaping'},
    {k:['open','openingstijden','tijd','tijden','wanneer','uren','gesloten','vandaag'], r:'🕐 <b>Openingstijden:</b><br>Ma–Wo & Vr: 10:00–17:00 · Do: 12:00–21:00 · Za: 10:00–17:00 · Zo: 12:00–17:00'},
    {k:['waar','adres','locatie','zitten','bereiken','parkeren','elst','route'], r:'📍 Selé Beauty Studio zit in <b>Elst (Gelderland)</b>, tussen Arnhem en Nijmegen.'},
    {k:['boek','boeken','afspraak','reserveren','plan','planning'], r:'📅 Je kunt direct online boeken:<br><a href="'+BOOK_URL+'" target="_blank" rel="noopener" class="sele-book">📅 Boek een afspraak</a>'},
    {k:['hoelang','houdbaar','blijven','hoe lang'], r:'⏱️ Blowout: 45–60 min · Botox Glow: ±3–4 mnd · Marrocare: ±6 mnd · Permanent: blijvend.'},
    {k:['contact','telefoon','email','mail','instagram'], r:'📧 info@beautystudioelst.nl<br>📸 Instagram: @sele.beautystudio'},
    {k:['dank','bedankt','top','super','perfect','oke','goed'], r:'Graag gedaan! 💕 Nog iets anders?'}
  ];
  var QUICK = ['💶 Prijzen','💇‍♀️ Keratine','💨 Blowout','👁️ Wenkbrauwen','🕐 Openingstijden','📅 Afspraak boeken'];

  var body = document.getElementById('seleChatBody');
  var input = document.getElementById('seleChatInput');

  function answer(t){ t=t.toLowerCase(); var best=null,bs=0; for(var i=0;i<KB.length;i++){var s=0;for(var j=0;j<KB[i].k.length;j++){if(t.indexOf(KB[i].k[j])>=0)s+=KB[i].k[j].length;}if(s>bs){bs=s;best=KB[i];}} return best?best.r:'Goeie vraag! Ik kan je het beste helpen met vragen over behandelingen, prijzen, openingstijden of boeken. 😊'; }
  function add(t,w){ var d=document.createElement('div'); d.className='sele-msg '+w; d.innerHTML=t; body.appendChild(d); body.scrollTop=body.scrollHeight; }
  function typing(cb){ var d=document.createElement('div'); d.className='sele-typing'; d.innerHTML='<span></span><span></span><span></span>'; body.appendChild(d); body.scrollTop=body.scrollHeight; setTimeout(function(){d.remove();cb();},650); }
  function send(t){ if(!t||!t.trim())return; add(t,'user'); input.value=''; typing(function(){add(answer(t),'bot');}); }

  document.getElementById('seleChatBubble').onclick = function(){ document.getElementById('seleChatWindow').classList.toggle('open'); };
  document.getElementById('seleChatClose').onclick = function(){ document.getElementById('seleChatWindow').classList.remove('open'); };
  document.getElementById('seleChatSend').onclick = function(){ send(input.value); };
  input.addEventListener('keydown', function(e){ if(e.key==='Enter')send(input.value); });

  var q = document.getElementById('seleQuick'); QUICK.forEach(function(x){ var b=document.createElement('button'); b.textContent=x; b.onclick=function(){send(x);}; q.appendChild(b); });
  typing(function(){ add('Hoi! 👋 Welkom bij Selé Beauty Studio. Stel gerust je vraag over behandelingen, prijzen of openingstijden!','bot'); });
})();
