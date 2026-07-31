(function(){
"use strict";
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var fine   = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

// ── Grid field lines on dark sections ──
(function(){
  var svg="<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g fill='none' stroke='rgba(207,38,26,0.07)' stroke-width='0.7' stroke-linecap='round'><path d='M0,60 L120,60'/><path d='M60,0 L60,120'/><path d='M0,0 L120,120'/><path d='M120,0 L0,120'/><circle cx='60' cy='60' r='30' /><circle cx='60' cy='60' r='15'/><circle cx='0' cy='0' r='8'/><circle cx='120' cy='0' r='8'/><circle cx='0' cy='120' r='8'/><circle cx='120' cy='120' r='8'/><circle cx='60' cy='0' r='5'/><circle cx='0' cy='60' r='5'/><circle cx='120' cy='60' r='5'/><circle cx='60' cy='120' r='5'/></g></svg>";
  var enc='url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
  document.querySelectorAll('section,footer').forEach(function(el){
    if(el.classList.contains('hero-bg'))return;
    var bg=el.getAttribute('style')||'';
    if(!/#14100E|#221714|#0A0706/.test(bg))return;
    var cur=getComputedStyle(el).backgroundImage;
    if(cur && cur!=='none'){ el.style.backgroundImage=enc+', '+cur; el.style.backgroundSize='120px 120px, auto'; el.style.backgroundRepeat='repeat, no-repeat'; }
    else { el.style.backgroundImage=enc; el.style.backgroundSize='120px 120px'; el.style.backgroundRepeat='repeat'; }
  });
})();

// ── Marquee: duplicate track for seamless loop ──
(function(){var mq=document.getElementById('mq');if(mq)mq.innerHTML+=mq.innerHTML;})();

// ── Reveal on scroll (all variants) ──
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-s').forEach(function(el){io.observe(el);});

// ── Scroll progress bar + back-to-top + nav ──
var prog=document.getElementById('progress'), toTop=document.getElementById('toTop'), nav=document.getElementById('nav');
var sections=[].slice.call(document.querySelectorAll('section[id]'));
var navLinks=[].slice.call(document.querySelectorAll('#nav a[href^="#"]'));
function onScroll(){
  var st=window.pageYOffset||document.documentElement.scrollTop;
  var h=document.documentElement.scrollHeight-window.innerHeight;
  if(prog)prog.style.width=(h>0?(st/h*100):0)+'%';
  if(toTop)toTop.classList.toggle('show',st>600);
  if(nav)nav.style.background= st>40 ? 'rgba(11,8,7,.9)' : 'rgba(11,8,7,.55)';
  var cur='';
  sections.forEach(function(s){ if(st>=s.offsetTop-140) cur=s.id; });
  navLinks.forEach(function(a){ a.classList.toggle('nav-active', a.getAttribute('href')==='#'+cur); });
}
window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
if(toTop)toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});});

// ── Count-up KPIs ──
function countUp(el){
  var target=parseFloat(el.getAttribute('data-count')), suf=el.getAttribute('data-suffix')||'';
  el.classList.add('kpi-pop');
  if(reduce){el.textContent=target+suf;return;}
  var start=null, dur=1500;
  function step(t){ if(!start)start=t; var p=Math.min((t-start)/dur,1); var e=1-Math.pow(1-p,3);
    el.textContent=Math.round(target*e)+suf; if(p<1)requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
var kio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);kio.unobserve(e.target);}});},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(function(el){kio.observe(el);});

if(fine && !reduce){
  // ── Cursor glow ──
  var glow=document.getElementById('cursor-glow'), gx=0,gy=0,cx=0,cy=0,glowOn=false;
  document.addEventListener('mousemove',function(e){gx=e.clientX;gy=e.clientY;if(!glowOn){glowOn=true;glow.style.opacity='1';}});
  document.addEventListener('mouseleave',function(){glowOn=false;glow.style.opacity='0';});
  (function loop(){cx+=(gx-cx)*.15;cy+=(gy-cy)*.15;glow.style.left=cx+'px';glow.style.top=cy+'px';requestAnimationFrame(loop);})();

  // ── Card 3D tilt + spotlight ──
  document.querySelectorAll('.ov-card, .tilt').forEach(function(card){
    var spotOK=/(ov-card)/.test(card.className);
    var spot=null;
    if(spotOK){spot=document.createElement('div');spot.className='spot';card.insertBefore(spot,card.firstChild);}
    var amt=card.classList.contains('post-card')||card.classList.contains('video-ph')?9:8;
    var lift=card.classList.contains('post-card')||card.classList.contains('video-ph')?-4:-6;
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      card.style.transform='perspective(850px) rotateY('+((px-.5)*amt).toFixed(2)+'deg) rotateX('+((.5-py)*amt).toFixed(2)+'deg) translateY('+lift+'px)';
      if(spot){spot.style.setProperty('--mx',(px*100)+'%');spot.style.setProperty('--my',(py*100)+'%');}
    });
    card.addEventListener('mouseleave',function(){card.style.transform='';});
  });

  // ── Magnetic buttons ──
  document.querySelectorAll('.btn').forEach(function(b){
    b.classList.add('mag');
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();
      b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.35-2).toFixed(1)+'px)';});
    b.addEventListener('mouseleave',function(){b.style.transform='';});
  });

  // ── Hero parallax on mouse ──
  var hero=document.getElementById('hero-inner');
  if(hero){document.querySelector('.hero-bg').addEventListener('mousemove',function(e){
    var dx=(e.clientX/window.innerWidth-.5), dy=(e.clientY/window.innerHeight-.5);
    hero.style.transform='translate('+(dx*-16).toFixed(1)+'px,'+(dy*-12).toFixed(1)+'px)';});}
}

// ── Ripple on buttons ──
document.querySelectorAll('.btn').forEach(function(b){
  b.addEventListener('click',function(e){var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height),
    rp=document.createElement('span');rp.className='ripple';rp.style.width=rp.style.height=d+'px';
    rp.style.left=(e.clientX-r.left-d/2)+'px';rp.style.top=(e.clientY-r.top-d/2)+'px';
    b.appendChild(rp);setTimeout(function(){rp.remove();},650);});
});

// ── Mobile hamburger nav ──
(function(){
  var t=document.getElementById('navToggle'), l=document.getElementById('navLinks');
  if(!t||!l)return;
  function close(){l.classList.remove('open');t.classList.remove('open');t.setAttribute('aria-expanded','false');}
  t.addEventListener('click',function(e){e.stopPropagation();var o=!l.classList.contains('open');l.classList.toggle('open',o);t.classList.toggle('open',o);t.setAttribute('aria-expanded',o);});
  l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
  document.addEventListener('click',function(e){if(!l.contains(e.target)&&!t.contains(e.target))close();});
})();
})();
