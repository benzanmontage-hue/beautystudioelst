/* Selé Beauty Studio — AI Chatbot Widget (zelfstandig, injecteert CSS+HTML+logica) */
(function(){
  if (window.__seleChatLoaded) return; window.__seleChatLoaded = true;

  const BOOK_URL = 'https://beautystudioelst.setmore.com/';

  var css = `
#seleChatBubble{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#3a2c24;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(58,44,36,.28);transition:transform .25s;z-index:90}
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
#seleChatBubble:focus-visible{outline:3px solid #b57f69;outline-offset:3px}
@media(max-width:860px){#seleChatBubble{bottom:calc(86px + env(safe-area-inset-bottom));right:14px;width:50px;height:50px}#seleChatBubble svg{width:22px;height:22px}#seleChatWindow{bottom:calc(146px + env(safe-area-inset-bottom));right:14px}}
`;

  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var html = '<button id="seleChatBubble" aria-label="Stel een vraag via de chat"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12z"/></svg></button>' +
  '<div id="seleChatWindow"><div class="sele-head"><div class="avatar">S</div><div class="meta"><b>Selé Assistant</b><span><span class="dot"></span> Antwoordt direct op veelgestelde vragen</span></div><button class="close" id="seleChatClose" aria-label="Chat sluiten">×</button></div>' +
  '<div class="sele-body" id="seleChatBody"></div><div class="sele-quick" id="seleQuick"></div>' +
  '<div class="sele-foot"><input type="text" id="seleChatInput" placeholder="Stel je vraag…"><button id="seleChatSend" aria-label="Verstuur"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);

  var BROWS = '/wenkbrauwen.html';
  var KB = [
    {k:['hoi','hallo','hey','goedendag','hi'], r:'Hoi! Welkom bij Selé Beauty Studio. Ik help je graag met je brows: welke behandeling past, hoe lang het blijft en hoe je je voorbereidt. Ook voor blowouts en keratine kun je hier terecht.'},
    {k:['welke brow','welke past','past bij mij','kiezen','twijfel','advies'], r:'<b>Welke brows passen bij jou?</b><br>• Vooral een nette basis: <b>Brow Shape</b> (€20)<br>• Meer kleur en definitie: <b>Brow Signature</b> (€40)<br>• Gelift, fluffy en voller: <b>Brow Luxe</b> (€57)<br>Twijfel je nog? Stuur een DM op Instagram, Selina denkt met je mee.<br><a href="'+BROWS+'#kies" class="sele-book">Vergelijk de behandelingen</a>'},
    {k:['wenkbrauw','wenkbrauwen','brow','brows','epileren','shape','shapen'], r:'<b>Wenkbrauwen</b><br>• <b>Brow Shape</b> (€20, ± 30 min): epileren en/of trimmen<br>• <b>Brow Signature</b> (€40, ± 40 min): shaping + henna of hybrid tint<br>• <b>Brow Luxe</b> (€57, ± 60 min): lamination + hybrid tint of henna + shaping<br><a href="'+BROWS+'" class="sele-book">Alles over wenkbrauwen</a>'},
    {k:['henna','hybrid','tint','verven','kleur','verschil'], r:'<b>Henna of hybrid tint</b> geven je wenkbrauwen allebei kleur en definitie. Je kiest zelf welke je wilt; twijfel je, dan denkt Selina met je mee. De kleur blijft ± 2–4 weken mooi. Je krijgt het in de <b>Brow Signature</b> (€40) en de <b>Brow Luxe</b> (€57).'},
    {k:['lamination','lift','fluffy','laminatie'], r:'Bij een <b>brow lamination</b> worden je wenkbrauwharen gelift en in model gestyled, voor gelifte, fluffy en vollere brows. Houdt ± 6–8 weken. Zit in de <b>Brow Luxe</b> (€57, ± 60 min), samen met kleur en shaping.'},
    {k:['pijn','pijnlijk','doet het pijn'], r:'Een lamination doet geen pijn: je ligt even lekker terwijl je brows gelift en in vorm gebracht worden.'},
    {k:['voorbereiden','voorbereiding','make-up','makeup','nazorg','verzorgen'], r:'<b>Voor je afspraak:</b> kom bij voorkeur zonder make-up op je wenkbrauwen.<br><b>Daarna:</b> kleur blijft ± 2–4 weken mooi, een lamination ± 6–8 weken. Vraag Selina gerust hoe je je brows het beste verzorgt.'},
    {k:['hoelang','houdbaar','blijven','hoe lang','weken','maanden'], r:'<b>Hoe lang blijft het mooi?</b><br>• Henna of hybrid tint: ± 2–4 weken<br>• Brow lamination: ± 6–8 weken<br>• Keratin Glow: ± 3–4 maanden · Marrocare: tot ± 6 maanden · Permanent Straight: blijvend<br>• Blowout: tot je je haar weer wast'},
    {k:['prijs','prijzen','kosten','tarief','tarieven','hoe duur','euro','€'], r:'<b>Wenkbrauwen</b><table class="pl"><tr><td>Brow Shape</td><td>€20</td></tr><tr><td>Brow Signature</td><td>€40</td></tr><tr><td>Brow Luxe</td><td>€57</td></tr></table><br><b>Ook in de studio</b><table class="pl"><tr><td>Classic Blowout</td><td>€40</td></tr><tr><td>Sleek Blowout</td><td>€45</td></tr><tr><td>Bombshell Blowout</td><td>€55</td></tr><tr><td>Keratin Glow</td><td>v.a. €90</td></tr><tr><td>Marrocare Smooth</td><td>v.a. €150</td></tr><tr><td>Permanent Straight</td><td>v.a. €220</td></tr></table>'},
    {k:['keratine','smoothing','keratin glow','marrocare','permanent','steil','pluis'], r:'<b>Keratine & smoothing</b><br>• <b>Keratin Glow</b> (v.a. €90): zacht en pluisvrij, ± 3–4 maanden<br>• <b>Marrocare Smooth</b> (v.a. €150): tot ± 80% rechter, tot ± 6 maanden<br>• <b>Permanent Straight</b> (v.a. €220): blijvend steil'},
    {k:['blowout','fohn','föhn','volume','krullen','haar'], r:'<b>Blowouts</b><br>• <b>Classic</b> (€40, 45 min): volumineus, everyday glam<br>• <b>Sleek</b> (€45, 45–60 min): strak en gepolijst<br>• <b>Bombshell</b> (€55, 60 min): maximaal volume, "big hair"'},
    {k:['open','openingstijden','tijd','tijden','wanneer','uren','gesloten','vandaag'], r:'<b>Openingstijden</b><br>Ma, di, wo, vr en za: 10:00–17:00<br>Do: 12:00–21:00<br>Zo: 12:00–17:00'},
    {k:['waar','adres','locatie','zitten','bereiken','parkeren','elst','route'], r:'Selé Beauty Studio zit aan de <b>Dorpsstraat 57, 6661 EG Elst</b> (Gelderland), tussen Arnhem en Nijmegen.<br><a href="https://maps.app.goo.gl/BmvqbKFkTvpZPRbR7" target="_blank" rel="noopener" class="sele-book">Route plannen</a>'},
    {k:['boek','boeken','afspraak','reserveren','plan','planning'], r:'Je boekt direct online.<br><a href="'+BOOK_URL+'" target="_blank" rel="noopener" class="sele-book">Boek een afspraak</a>'},
    {k:['betalen','pin','contant','tikkie','betaal'], r:'Je betaalt in de studio met pin, contant of een betaalverzoek (Tikkie).'},
    {k:['annuleren','verplaatsen','afzeggen'], r:'Verplaatsen of annuleren kan via de link in je bevestigingsmail, graag minimaal 24 uur van tevoren.'},
    {k:['contact','telefoon','email','mail','instagram','dm'], r:'E-mail: info@beautystudioelst.nl<br>Instagram: <a href="https://www.instagram.com/sele.beautystudio" target="_blank" rel="noopener">@sele.beautystudio</a>'},
    {k:['dank','bedankt','top','super','perfect','oke','goed'], r:'Graag gedaan! Nog iets anders?'}
  ];
  var QUICK = ['Welke brow past bij mij?', 'Henna of hybrid tint?', 'Hoe lang blijft het mooi?', 'Voorbereiden', 'Prijzen', 'Afspraak boeken', 'Blowout & keratine'];
  var QMAP = {'Blowout & keratine':'blowout keratine','Voorbereiden':'voorbereiden'};

  var body = document.getElementById('seleChatBody');
  var input = document.getElementById('seleChatInput');

  function answer(t){ t=t.toLowerCase(); var best=null,bs=0; for(var i=0;i<KB.length;i++){var s=0;for(var j=0;j<KB[i].k.length;j++){if(t.indexOf(KB[i].k[j])>=0)s+=KB[i].k[j].length;}if(s>bs){bs=s;best=KB[i];}} return best?best.r:'Goeie vraag! Ik help je het beste met vragen over wenkbrauwen, prijzen, openingstijden of boeken. Voor iets anders kun je Selina een DM sturen op Instagram.'; }
  function add(t,w){ var d=document.createElement('div'); d.className='sele-msg '+w; d.innerHTML=t; body.appendChild(d); body.scrollTop=body.scrollHeight; }
  function typing(cb){ var d=document.createElement('div'); d.className='sele-typing'; d.innerHTML='<span></span><span></span><span></span>'; body.appendChild(d); body.scrollTop=body.scrollHeight; setTimeout(function(){d.remove();cb();},650); }
  function send(t){ if(!t||!t.trim())return; add(t,'user'); input.value=''; var q=QMAP[t]||t; typing(function(){ if(q==='blowout keratine'){ add(answer('blowout'),'bot'); add(answer('keratine'),'bot'); } else add(answer(q),'bot'); }); }

  document.getElementById('seleChatBubble').onclick = function(){ document.getElementById('seleChatWindow').classList.toggle('open'); };
  document.getElementById('seleChatClose').onclick = function(){ document.getElementById('seleChatWindow').classList.remove('open'); };
  document.getElementById('seleChatSend').onclick = function(){ send(input.value); };
  input.addEventListener('keydown', function(e){ if(e.key==='Enter')send(input.value); });

  var q = document.getElementById('seleQuick'); QUICK.forEach(function(x){ var b=document.createElement('button'); b.textContent=x; b.onclick=function(){send(x);}; q.appendChild(b); });
  typing(function(){ add('Hoi! Ik help je graag met je brows: welke behandeling past, hoe lang het blijft en hoe je je voorbereidt. Ook voor blowouts en keratine kun je hier terecht.','bot'); });
})();
