/* ══ EmailJS ══ */
(function(){ if(window.emailjs) emailjs.init("ouwThvw_yAzbu5L4Z"); })();
const sendBtn = document.getElementById('sendBtn');
if(sendBtn){
  sendBtn.addEventListener('click',()=>{
    const n=document.getElementById('name').value.trim();
    const e=document.getElementById('email').value.trim();
    const s=document.getElementById('subject').value.trim();
    const m=document.getElementById('message').value.trim();
    if(!n||!e||!s||!m){ alert('Please fill all fields'); return; }
    emailjs.send("service_npx2skm","template_9e8ybuo",{name:n,email:e,subject:s,message:m})
      .then(()=>alert('Message sent!')).catch(()=>alert('Failed.'));
  });
}

/* ── Core buttons ── */
document.getElementById('downloadBtn')?.addEventListener('click',()=>window.open("MY_CV .docx","_blank"));
document.getElementById('btn-work')?.addEventListener('click',()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'}));
document.getElementById('btn-work2')?.addEventListener('click',()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'}));
document.getElementById('btn-contact')?.addEventListener('click',()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}));

/* ── Theme toggle ── */
const themeBtn = document.getElementById('themeToggle');
function applyTheme(light){
  document.body.classList.toggle('light', light);
  if(themeBtn) themeBtn.innerHTML = light ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
applyTheme(localStorage.getItem('theme') === 'light');
themeBtn?.addEventListener('click',()=>{
  const l = !document.body.classList.contains('light');
  localStorage.setItem('theme', l ? 'light' : 'dark');
  applyTheme(l);
});

/* ── Active nav (hero-nav-link) ── */
document.querySelectorAll('section[id]').forEach(sec=>{
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      document.querySelectorAll('.hero-nav-link,.mbn-link').forEach(a=>a.classList.remove('active'));
      document.querySelectorAll('[href="#'+sec.id+'"]').forEach(a=>a.classList.add('active'));
    }
  },{threshold:0.35}).observe(sec);
});

/* ── Home nav: scroll to top ── */
document.querySelectorAll('a[href="#home"],.drawer-link[href="#home"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    window.scrollTo({top:0,behavior:'smooth'});
  });
});

/* ── Hamburger drawer ── */
(function(){
  const btn=document.getElementById('hamburgerBtn');
  const drawer=document.getElementById('mobileDrawer');
  const backdrop=document.getElementById('drawerBackdrop');
  if(!btn||!drawer) return;
  function openD(){ drawer.classList.add('open'); backdrop?.classList.add('open'); btn.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeD(){ drawer.classList.remove('open'); backdrop?.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow=''; }
  btn.addEventListener('click',()=>drawer.classList.contains('open')?closeD():openD());
  backdrop?.addEventListener('click',closeD);
  drawer.querySelectorAll('.drawer-link').forEach(a=>a.addEventListener('click',closeD));
})();

/* ── Mobile bottom nav ── */
(function(){
  const links=document.querySelectorAll('.mbn-link');
  links.forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const t=document.querySelector(a.getAttribute('href'));
      if(t) t.scrollIntoView({behavior:'smooth'});
    });
  });
})();

/* ══ STATS MODAL — click kira22 image to open ══ */
(function(){
  const cardImg  = document.getElementById('playerCardImg');
  const overlay  = document.getElementById('statsOverlay');
  const closeBtn = document.getElementById('statsClose');
  const canvas   = document.getElementById('radarChart');
  if(!overlay) return;

  const ATTRS = [
    {label:'PACE',val:90},{label:'VISION',val:92},{label:'PASSING',val:88},
    {label:'DEFENSE',val:75},{label:'STAMINA',val:85},{label:'TECHNIQUE',val:95},
  ];

  function drawRadar(){
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const w=canvas.width, h=canvas.height, cx=w/2, cy=h/2;
    const r=Math.min(w,h)*0.36, n=ATTRS.length;
    ctx.clearRect(0,0,w,h);
    for(let ring=1;ring<=5;ring++){
      ctx.beginPath();
      for(let i=0;i<n;i++){
        const a=(i/n)*Math.PI*2-Math.PI/2, rr=r*(ring/5);
        i===0?ctx.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);
      }
      ctx.closePath(); ctx.strokeStyle='rgba(200,160,0,.15)'; ctx.lineWidth=1; ctx.stroke();
    }
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2-Math.PI/2;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.strokeStyle='rgba(200,160,0,.12)'; ctx.lineWidth=1; ctx.stroke();
    }
    ctx.beginPath();
    ATTRS.forEach((at,i)=>{
      const a=(i/n)*Math.PI*2-Math.PI/2, rr=r*(at.val/100);
      i===0?ctx.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);
    });
    ctx.closePath(); ctx.fillStyle='rgba(100,160,255,.35)'; ctx.fill();
    ctx.strokeStyle='rgba(100,160,255,.85)'; ctx.lineWidth=2; ctx.stroke();
    ATTRS.forEach((at,i)=>{
      const a=(i/n)*Math.PI*2-Math.PI/2, rr=r*(at.val/100);
      const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr;
      ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fillStyle='#c8a000'; ctx.fill();
      ctx.font='bold 9px Segoe UI'; ctx.fillStyle='rgba(255,255,255,.6)'; ctx.textAlign='center';
      ctx.fillText(at.label, cx+Math.cos(a)*r*1.22, cy+Math.sin(a)*r*1.22+4);
    });
  }

  function openModal(){
    overlay.removeAttribute('hidden');
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    drawRadar();
    overlay.querySelectorAll('.av').forEach(el=>{
      const target=parseInt(el.dataset.val||'0');
      let cur=0; const step=Math.ceil(target/25);
      const t=setInterval(()=>{ cur=Math.min(cur+step,target); el.textContent=cur; if(cur>=target)clearInterval(t); },30);
    });
  }
  function closeModal(){
    overlay.hidden = true;
    overlay.setAttribute('hidden','');
    document.body.style.overflow = '';
  }

  /* click the image to open */
  cardImg?.addEventListener('click', openModal);
  /* X button closes */
  closeBtn?.addEventListener('click', e=>{ e.stopPropagation(); closeModal(); });
  /* click backdrop closes */
  overlay?.addEventListener('click', e=>{ if(e.target===overlay) closeModal(); });
  /* Escape key closes */
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'&&!overlay.hidden) closeModal(); });
})();

/* ══ ABOUT — read more / achievements ══ */
(function(){
  const moreBtn  = document.getElementById('aboutMoreBtn');
  const moreText = document.getElementById('aboutQuoteMore');
  if(moreBtn && moreText){
    moreBtn.addEventListener('click',()=>{
      const open = moreText.hidden;
      moreText.hidden = !open;
      moreBtn.innerHTML = open
        ? 'Read Less <i class="fas fa-chevron-up"></i>'
        : 'Read More <i class="fas fa-chevron-down"></i>';
    });
  }
  const achBtn  = document.getElementById('achToggleBtn');
  const achList = document.getElementById('achList');
  if(achBtn && achList){
    achBtn.addEventListener('click',()=>{
      const open = achList.hidden;
      achList.hidden = !open;
      achBtn.setAttribute('aria-expanded', open);
    });
  }
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
    document.getElementById('detailDemo').href=d.dataset.demo;
    document.getElementById('detailSource').href=d.dataset.source;
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
