/* ══ CONTACT FORM — Formspree ══
   Replace FORMSPREE_ENDPOINT with your endpoint from formspree.io
   e.g. https://formspree.io/f/xyzabc12
   Free plan: 50 submissions/month, no backend needed
══ */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyzabc12"; // ← replace this

const sendBtn = document.getElementById('sendBtn');
if(sendBtn){
  sendBtn.addEventListener('click', async ()=>{
    const n = document.getElementById('name').value.trim();
    const e = document.getElementById('email').value.trim();
    const s = document.getElementById('subject').value.trim();
    const m = document.getElementById('message').value.trim();

    if(!n||!e||!s||!m){
      sendBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Fill all fields';
      setTimeout(()=>{ sendBtn.innerHTML = 'SIGN CONTRACT <i class="fas fa-pen-nib"></i>'; }, 2000);
      return;
    }

    const orig = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: n, email: e, subject: s, message: m })
      });

      if(res.ok){
        sendBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        sendBtn.style.background = 'linear-gradient(135deg,#2ecc71,#27ae60)';
        ['name','email','subject','message'].forEach(id=>{
          const el = document.getElementById(id);
          if(el) el.value = '';
        });
        setTimeout(()=>{
          sendBtn.innerHTML = orig;
          sendBtn.style.background = '';
          sendBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Server error ' + res.status);
      }
    } catch(err) {
      console.error('Form error:', err);
      sendBtn.innerHTML = '<i class="fas fa-times"></i> Failed — opening email';
      sendBtn.style.background = 'linear-gradient(135deg,#e74c3c,#c0392b)';
      setTimeout(()=>{
        sendBtn.innerHTML = orig;
        sendBtn.style.background = '';
        sendBtn.disabled = false;
      }, 3000);
      // fallback: open email client
      window.location.href = 'mailto:johnneah124@gmail.com'
        + '?subject=' + encodeURIComponent(s)
        + '&body='    + encodeURIComponent('From: ' + n + ' (' + e + ')\n\n' + m);
    }
  });
})();

/* ══ CONTRACT — more info slide from left ══ */
(function(){
  const btn = document.getElementById('moreInfoBtn');
  const box = document.getElementById('contractExpandable');
  if(!btn||!box) return;
  btn.addEventListener('click',()=>{
    const open = box.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    const arrow = btn.querySelector('i');
    if(arrow) arrow.style.transform = open ? 'rotate(90deg)' : 'rotate(0)';
  });
})();

/* ══ SKILLS ARENA REVEAL — toggle ══ */
(function(){
  const btn   = document.getElementById('btnEnterArena');
  const arena = document.getElementById('skillsArenaWrap');
  if(!btn||!arena) return;
  let open = false;
  btn.addEventListener('click',()=>{
    open = !open;
    if(open){
      arena.classList.add('visible');
      btn.classList.add('arena-active');
      btn.innerHTML = '<i class="fas fa-times-circle"></i> Hide Arena';
      arena.scrollIntoView({behavior:'smooth',block:'start'});
      document.querySelectorAll('.ss-fill').forEach((bar,i)=>{
        const w=bar.style.width; bar.style.width='0';
        setTimeout(()=>{ bar.style.width=w; },i*100+100);
      });
    } else {
      arena.classList.remove('visible');
      btn.classList.remove('arena-active');
      btn.innerHTML = '<i class="fas fa-futbol"></i> Enter Skills Arena';
    }
  });
})();

/* ══ SKILLS ARENA FILTER ══ */
(function(){
  const filters = document.querySelectorAll('.arena-filter');
  const balls   = document.querySelectorAll('.skill-ball');
  filters.forEach(btn=>{
    btn.addEventListener('click',()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      balls.forEach(b=>b.classList.toggle('hidden', f!=='all' && b.dataset.cat!==f));
    });
  });
})();

/* ══ LOCKER ROOM CAROUSEL + DETAIL PANEL ══ */
(function(){
  const carousel = document.getElementById('jerseyCarousel');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');
  const panel    = document.getElementById('projDetailPanel');
  if(!carousel) return;

  const allCards = Array.from(carousel.querySelectorAll('.jersey-card'));
  let visible    = [...allCards];
  let offset     = 0;
  let activeIdx  = -1;

  function perPage(){
    const w=window.innerWidth;
    if(w<=420) return 1; if(w<=600) return 2; if(w<=900) return 3; if(w<=1100) return 4; return 5;
  }

  function render(){
    const pp=perPage(), max=Math.max(0,visible.length-pp);
    offset=Math.min(offset,max);
    allCards.forEach(c=>c.style.display='none');
    visible.forEach((c,i)=>{ c.style.display=(i>=offset&&i<offset+pp)?'':'none'; });
    if(prevBtn) prevBtn.disabled=offset===0;
    if(nextBtn) nextBtn.disabled=offset>=visible.length-pp;
  }

  prevBtn?.addEventListener('click',()=>{ offset=Math.max(0,offset-1); render(); });
  nextBtn?.addEventListener('click',()=>{ offset=Math.min(visible.length-perPage(),offset+1); render(); });

  function openDetail(card,i){
    if(activeIdx===i){ panel.hidden=true; card.classList.remove('active'); activeIdx=-1; return; }
    activeIdx=i;
    allCards.forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
    const d=card.querySelector('.proj-detail-data');
    if(!d||!panel) return;
    document.getElementById('detailName').textContent=d.dataset.name;
    document.getElementById('detailDesc').textContent=d.dataset.desc;
    const demoEl=document.getElementById('detailDemo'); demoEl.href=d.dataset.demo; demoEl.target=d.dataset.demo!=='#'?'_blank':''; demoEl.rel='noopener';
    const srcEl=document.getElementById('detailSource'); srcEl.href=d.dataset.source; srcEl.target='_blank'; srcEl.rel='noopener';
    const img=document.getElementById('detailImg'), ph=document.getElementById('detailPlaceholder');
    if(d.dataset.img){ img.src=d.dataset.img; img.style.display='block'; ph.style.display='none'; }
    else { img.style.display='none'; ph.style.display='flex'; }
    document.getElementById('detailTags').innerHTML=d.dataset.tags.split(',').map(t=>`<span>${t.trim()}</span>`).join('');
    document.getElementById('detailFeatures').innerHTML=d.dataset.features.split('|').map(f=>`<li><i class="fas fa-check-circle"></i> ${f.trim()}</li>`).join('');
    panel.hidden=false;
    panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  allCards.forEach((card,i)=>{
    card.addEventListener('click',()=>openDetail(card,i));
    card.querySelector('.jersey-view-btn')?.addEventListener('click',e=>{ e.stopPropagation(); openDetail(card,i); });
  });

  window.addEventListener('resize',render);
  setTimeout(render, 100);
  render();
})();

/* ══ PARALLAX ══ */
(function(){
  const layers=[
    {sel:'.hero-grain',speed:0.12},{sel:'.hero-left',speed:-0.08},
    {sel:'.hero-right',speed:0.06},{sel:'.hero-content',speed:-0.05},
    {sel:'.hero-socials',speed:0.04},{sel:'.skills-stadium-lights',speed:0.1},
    {sel:'.contract-center',speed:-0.04},{sel:'.proj-plan-box',speed:0.06},
  ];
  const els=layers.map(l=>({el:document.querySelector(l.sel),speed:l.speed})).filter(l=>l.el);
  let ticking=false;
  function applyParallax(){
    const sy=window.scrollY;
    els.forEach(({el,speed})=>{ el.style.transform=`translateY(${sy*speed}px)`; });
    ticking=false;
  }
  window.addEventListener('scroll',()=>{ if(!ticking){ requestAnimationFrame(applyParallax); ticking=true; } },{passive:true});
})();

/* ══ ANTI-GRAVITY 3D TILT ══ */
(function(){
  const floaters=[
    {sel:'.about-card-wrap',strength:14},{sel:'.skills-card-col',strength:10},
    {sel:'.contract-form-card',strength:8},{sel:'.proj-plan-box',strength:12},
  ];
  floaters.forEach(({sel,strength})=>{
    const el=document.querySelector(sel);
    if(!el) return;
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      el.style.transform=`perspective(800px) rotateY(${dx*strength*.6}deg) rotateX(${-dy*strength*.5}deg) translateZ(${strength}px) translateY(-4px)`;
    });
    el.addEventListener('mouseleave',()=>{
      el.style.transition='transform .6s cubic-bezier(.25,.46,.45,.94)';
      el.style.transform='perspective(800px) rotateY(0) rotateX(0) translateZ(0) translateY(0)';
      setTimeout(()=>{ el.style.transition=''; },600);
    });
    el.addEventListener('mouseenter',()=>{ el.style.transition='transform .15s ease'; });
  });
})();

/* ══ SOFT SKILLS ANIMATE ON SCROLL ══ */
(function(){
  const panel=document.querySelector('.soft-skills-panel');
  if(!panel) return;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      panel.querySelectorAll('.ss-fill').forEach((bar,i)=>{
        const w=bar.style.width; bar.style.width='0';
        setTimeout(()=>{ bar.style.width=w; },i*100);
      });
    }
  },{threshold:0.3}).observe(panel);
})();

/* ══ HERO SCROLL CARD (desktop) ══ */
const flipCard    = document.getElementById('flipCard');
const flipInner   = document.getElementById('flipInner');
const heroSection = document.getElementById('home');
const aboutSection= document.getElementById('about');
const aboutSpacer = aboutSection?.querySelector('.about-spacer');
const heroGrain   = document.querySelector('.hero-grain');
const heroLeft    = document.querySelector('.hero-left');
const heroRight   = document.querySelector('.hero-right');
const isMobile    = ()=> window.innerWidth <= 900;
function easeInOut(t){ return t<.5?2*t*t:-1+(4-2*t)*t; }
let parked=false;

function onScroll(){
  if(isMobile()||!flipCard||!aboutSpacer) return;
  const sy=window.scrollY, heroH=heroSection.offsetHeight;
  const aboutTop=aboutSection.offsetTop, aboutH=aboutSection.offsetHeight;
  const journeyStart=heroH*0.3, journeyEnd=aboutTop+80;
  const raw=(sy-journeyStart)/(journeyEnd-journeyStart);
  const t=Math.max(0,Math.min(1,raw)), et=easeInOut(t);
  if(t<=0){
    flipCard.style.left=''; flipCard.style.top=''; flipCard.style.transform='translate(-50%,-50%)';
    flipInner.style.transform=''; flipInner.classList.remove('flipped'); parked=false; return;
  }
  const dest={left:aboutSpacer.getBoundingClientRect().left, top:aboutSpacer.getBoundingClientRect().top};
  if(t>=1&&!parked){
    flipCard.style.left=dest.left+'px'; flipCard.style.top=dest.top+'px';
    flipCard.style.transform='none'; flipInner.style.transform=''; flipInner.classList.add('flipped'); parked=true;
  }
  if(t>=1&&parked){
    const d2=aboutSpacer.getBoundingClientRect();
    flipCard.style.left=d2.left+'px'; flipCard.style.top=d2.top+'px'; flipCard.style.transform='none'; return;
  }
  parked=false;
  const vw=window.innerWidth, vh=window.innerHeight;
  const cw=flipCard.offsetWidth, ch=flipCard.offsetHeight;
  const fromL=vw/2-cw/2, fromT=vh/2-ch/2;
  flipCard.style.left=(fromL+(dest.left-fromL)*et)+'px';
  flipCard.style.top=(fromT+(dest.top-fromT)*et)+'px';
  flipCard.style.transform='none';
  if(t>0.55){ flipInner.style.transform=''; flipInner.classList.add('flipped'); }
  else { flipInner.classList.remove('flipped'); flipInner.style.transform=`rotateY(${et*88}deg)`; }
  flipCard.style.opacity=(sy>aboutTop+aboutH-60)?'0':'1';
}

document.addEventListener('mousemove',e=>{
  if(isMobile()||!flipInner) return;
  if(window.scrollY>(heroSection?.offsetHeight||0)*0.35) return;
  if(flipInner.classList.contains('flipped')) return;
  const cx=window.innerWidth/2, cy=window.innerHeight/2;
  const dx=(e.clientX-cx)/cx, dy=(e.clientY-cy)/cy;
  flipInner.style.transform=`perspective(900px) rotateY(${dx*12}deg) rotateX(${-dy*8}deg) translateZ(14px)`;
});
document.addEventListener('mouseleave',()=>{
  if(flipInner&&!flipInner.classList.contains('flipped')) flipInner.style.transform='';
});
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll);
window.addEventListener('load',onScroll);

/* ══ SECONDARY NAV — active state + smooth scroll ══ */
(function(){
  const snavLinks = document.querySelectorAll('.snav-link');
  const secNav    = document.getElementById('secondary-nav');

  /* smooth scroll */
  snavLinks.forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth'});
    });
  });

  /* active state via IntersectionObserver */
  document.querySelectorAll('section[id]').forEach(sec=>{
    new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        snavLinks.forEach(a=>a.classList.remove('active'));
        const m = document.querySelector('.snav-link[href="#'+sec.id+'"]');
        if(m) m.classList.add('active');
      }
    },{threshold:0.35}).observe(sec);
  });

  /* hide secondary nav while hero is in view */
  const hero = document.getElementById('home');
  if(hero && secNav){
    new IntersectionObserver(entries=>{
      secNav.style.display = entries[0].isIntersecting ? 'none' : '';
    },{threshold:0.1}).observe(hero);
  }
})();
