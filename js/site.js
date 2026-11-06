/* Selé Beauty Studio — gedeelde scripts */
(function(){
  var $ = function(s,c){ return (c||document).querySelector(s); };
  var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

  // menu
  var burger=$('#burger'), menu=$('#mmenu');
  if(burger && menu){
    var setMenu=function(open){ menu.classList.toggle('open',open); burger.setAttribute('aria-expanded',open); burger.setAttribute('aria-label',open?'Menu sluiten':'Menu openen'); };
    burger.addEventListener('click',function(){ setMenu(!menu.classList.contains('open')); });
    $$('a',menu).forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setMenu(false); });
  }

  // woorden opsplitsen voor de "licht op tijdens scrollen"-tekst
  $$('.words').forEach(function(el){
    var i=0;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function(w){ return '<span class="w" style="--w:'+(i++)+'">'+w+'</span>'; }).join(' ');
  });

  // reveal-fallback alleen als de browser geen scroll-driven animations kent
  var modern = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  var els=$$('.reveal');
  if(!modern && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){ var sib=el.parentElement?Array.prototype.indexOf.call(el.parentElement.children,el):0; el.style.transitionDelay=Math.min(sib,4)*70+'ms'; io.observe(el); });
  } else if(!modern){ els.forEach(function(el){ el.classList.add('in'); }); }

  // hoogte van de horizontale galerij afstemmen op de breedte van de foto's
  $$('.hscroll').forEach(function(h){
    var track=$('.hscroll-track',h);
    var fit=function(){ var extra=Math.max(0,track.scrollWidth-window.innerWidth); h.style.setProperty('--hs-height',(window.innerHeight+extra)+'px'); };
    fit(); window.addEventListener('resize',fit);
    $$('img',track).forEach(function(img){ if(!img.complete) img.addEventListener('load',fit); });
  });

  // openingstijden + live status (tijdzone Amsterdam)
  var H={0:[12,17],1:[10,17],2:[10,17],3:[10,17],4:[12,21],5:[10,17],6:[10,17]};
  try{
    var parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Amsterdam',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var get=function(t){ return (parts.find(function(p){return p.type===t;})||{}).value; };
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday'));
    var now=parseInt(get('hour'),10)%24 + parseInt(get('minute'),10)/60;
    var h=H[day], open=now>=h[0] && now<h[1], text;
    if(open){ text='Nu open tot '+h[1]+':00'; }
    else if(now<h[0]){ text='Vandaag open om '+h[0]+':00'; }
    else { text='Morgen open om '+H[(day+1)%7][0]+':00'; }
    $$('[data-status]').forEach(function(s){ s.classList.add(open?'is-open':'is-closed'); s.lastElementChild.textContent=text; });
    var li=$('#hours [data-day="'+day+'"]'); if(li){ li.classList.add('today'); li.firstElementChild.textContent+=' (vandaag)'; }
  }catch(e){}

  // voor/na schuifregelaar
  $$('[data-ba]').forEach(function(f){
    var r=$('.ba-range',f);
    r.addEventListener('input',function(){ f.style.setProperty('--pos',r.value+'%'); });
  });

  // kaart pas laden na klik (AVG + snelheid)
  var mb=$('#mapBtn');
  if(mb) mb.addEventListener('click',function(){
    var m=$('#map');
    m.innerHTML='<iframe src="https://www.google.com/maps?q=Dorpsstraat%2057%2C%206661%20EG%20Elst&output=embed" title="Kaart: Selé Beauty Studio, Dorpsstraat 57 Elst" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    m.classList.add('loaded');
  });

  // boekklikken meten (alleen als GA is toegestaan)
  $$('[data-track]').forEach(function(a){
    a.addEventListener('click',function(){ if(window.gtag){ gtag('event','boek_klik',{plek:a.getAttribute('data-track')}); } });
  });

  $$('[data-year]').forEach(function(y){ y.textContent=new Date().getFullYear(); });

  // cookies
  var cc=$('#cookieConsent');
  if(cc){
    var showCookie=function(){ cc.hidden=false; };
    try{ if(!localStorage.getItem('cookie-consent')) showCookie(); }catch(e){ showCookie(); }
    $$('[data-consent]',cc).forEach(function(b){
      b.addEventListener('click',function(){
        var v=b.getAttribute('data-consent');
        try{ localStorage.setItem('cookie-consent',v); }catch(e){}
        cc.hidden=true;
        if(v==='accepted' && window.loadGA) window.loadGA();
      });
    });
    var cr=$('#cookieReset');
    if(cr) cr.addEventListener('click',function(){ try{ localStorage.removeItem('cookie-consent'); }catch(e){} showCookie(); });
  }
})();
