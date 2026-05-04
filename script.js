/* ══ CONTACT FORM — Formspree ══ */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgzjagj"; // ← replace with your endpoint

const sendBtn = document.getElementById('sendBtn');
if(sendBtn){
  sendBtn.addEventListener('click', async ()=>{
    const n=document.getElementById('name').value.trim();
    const e=document.getElementById('email').value.trim();
    const s=document.getElementById('subject').value.trim();
    const m=document.getElementById('message').value.trim();
    if(!n||!e||!s||!m){
      sendBtn.textContent='Fill all fields first';
      setTimeout(()=>{ sendBtn.innerHTML='SIGN CONTRACT <i class="fas fa-pen-nib"></i>'; },2000);
      return;
    }
    const orig=sendBtn.innerHTML;
    sendBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled=true;
    try{
      const res=await fetch(FORMSPREE_ENDPOINT,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({name:n,email:e,subject:s,message:m})
      });
      if(res.ok){
        sendBtn.innerHTML='<i class="fas fa-check"></i> Message Sent!';
        sendBtn.style.background='linear-gradient(135deg,#2ecc71,#27ae60)';
        ['name','email','subject','message'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
        setTimeout(()=>{sendBtn.innerHTML=orig;sendBtn.style.background='';sendBtn.disabled=false;},3000);
      } else { throw new Error(res.status); }
    }catch(err){
      console.error(err);
      sendBtn.innerHTML='<i class="fas fa-times"></i> Failed — opening email';
      sendBtn.style.background='linear-gradient(135deg,#e74c3c,#c0392b)';
      setTimeout(()=>{sendBtn.innerHTML=orig;sendBtn.style.background='';sendBtn.disabled=false;},3000);
      window.location.href='mailto:johnneah124@gmail.com?subject='+encodeURIComponent(s)+'&body='+encodeURIComponent('From: '+n+' ('+e+')\n\n'+m);
    }
  });
}
document.getElementById('downloadBtn')?.addEventListener('click',()=>window.open("MY_CV .docx","_blank"));
document.getElementById('btn-work')?.addEventListener('click',()=>document.getElementById('projects').scrollIntoView({behavior:'smooth'}));
document.getElementById('btn-contact')?.addEventListener('click',()=>document.getElementById('contact').scrollIntoView({behavior:'smooth'}));

/* ══ Theme ══ */
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

/* ══ Active nav ══ */
const navLinks = document.querySelectorAll('.nav-link');
document.querySelectorAll('section[id]').forEach(sec=>{
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      navLinks.forEach(a=>a.classList.remove('active'));
      const m=document.querySelector('.nav-link[href="#'+sec.id+'"]');
      if(m) m.classList.add('active');
    }
  },{threshold:0.4}).observe(sec);
});

/* ══ Skill bars ══ */
const skillSec = document.getElementById('skills');
if(skillSec){
  let done=false;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting && !done){
      done=true;
      document.querySelectorAll('.bar-fill').forEach(bar=>{
        const tgt=parseInt(bar.dataset.target||'0',10);
        const pct=bar.parentElement.querySelector('.bar-pct');
        let cur=0; const step=Math.max(1,Math.floor(tgt/45));
        const timer=setInterval(()=>{
          cur+=step; if(cur>=tgt){cur=tgt;clearInterval(timer);}
          bar.style.width=cur+'%'; if(pct) pct.textContent=cur+'%';
        },16);
      });
    }
  },{threshold:0.3}).observe(skillSec);
}

/* ══ 3D tilt ══ */
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('mouseenter',()=>{ card.style.transition='transform .1s ease'; });
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(600px) rotateY(${x*16}deg) rotateX(${-y*12}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .5s ease';
    card.style.transform='perspective(600px) rotateY(0) rotateX(0) scale(1)';
  });
});

/* ══════════════════════════════════════════════
   FLIP CARD SCROLL BEHAVIOR

   Strategy:
   - Card starts centered in viewport via CSS
     (left:50%, top:50vh, transform:translate(-50%,-50%))
   - As user scrolls into the about section,
     JS moves the card to the about-spacer position
   - Card flips at 50% of the journey
   - Uses CSS transition for smooth movement
══════════════════════════════════════════════ */
const flipCard    = document.getElementById('flipCard');
const flipInner   = document.getElementById('flipInner');
const heroSection = document.getElementById('home');
const aboutSection= document.getElementById('about');
const aboutSpacer = aboutSection?.querySelector('.about-spacer');
const heroGrain   = document.querySelector('.hero-grain');
const heroLeft    = document.querySelector('.hero-left');
const heroRight   = document.querySelector('.hero-right');

const isMobile = ()=> window.innerWidth <= 900;

function easeInOut(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t; }

/* Returns the viewport top-left where the card should sit
   to visually overlap the target element */
function getTargetPos(el){
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top };
}

let parked = false;

function onScroll(){
  if(isMobile() || !flipCard || !aboutSpacer) return;

  const sy       = window.scrollY;
  const heroH    = heroSection.offsetHeight;
  const aboutTop = aboutSection.offsetTop;
  const aboutH   = aboutSection.offsetHeight;

  /* ── parallax on hero text ── */
  if(heroGrain) heroGrain.style.transform = `translate(-50%,-50%) translateY(${sy*0.1}px)`;
  if(heroLeft  && sy < heroH) heroLeft.style.transform  = `translateY(${sy*-0.08}px)`;
  if(heroRight && sy < heroH) heroRight.style.transform = `translateY(${sy*0.05}px)`;

  /* ── mouse tilt resets when scrolling ── */

  /* ── journey progress ──
     0 = hero fully visible
     1 = about-spacer has reached its resting viewport position */
  const journeyStart = heroH * 0.3;   // start moving after 30% of hero scrolled
  const journeyEnd   = aboutTop + 80; // end when we're 80px into about section
  const raw = (sy - journeyStart) / (journeyEnd - journeyStart);
  const t   = Math.max(0, Math.min(1, raw));
  const et  = easeInOut(t);

  if(t <= 0){
    flipCard.style.left       = '';
    flipCard.style.top        = '';
    flipCard.style.transform  = 'translate(-50%, -50%)';
    flipInner.style.transform = '';
    flipInner.classList.remove('flipped');
    parked = false;
    return;
  }

  /* get about-spacer viewport position */
  const dest = getTargetPos(aboutSpacer);

  if(t >= 1 && !parked){
    /* snap to final position and flip */
    flipCard.style.left      = dest.left + 'px';
    flipCard.style.top       = dest.top  + 'px';
    flipCard.style.transform = 'none';
    flipInner.style.transform = '';
    flipInner.classList.add('flipped');
    parked = true;
  }

  if(t >= 1 && parked){
    /* keep tracking about-spacer as page scrolls */
    const dest2 = getTargetPos(aboutSpacer);
    flipCard.style.left      = dest2.left + 'px';
    flipCard.style.top       = dest2.top  + 'px';
    flipCard.style.transform = 'none';
    return;
  }

  parked = false;

  /* interpolate from viewport center to about-spacer */
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cw = flipCard.offsetWidth;
  const ch = flipCard.offsetHeight;

  const fromLeft = vw / 2 - cw / 2;
  const fromTop  = vh / 2 - ch / 2;

  const curLeft = fromLeft + (dest.left - fromLeft) * et;
  const curTop  = fromTop  + (dest.top  - fromTop)  * et;

  flipCard.style.left      = curLeft + 'px';
  flipCard.style.top       = curTop  + 'px';
  flipCard.style.transform = 'none';

  /* flip at 55% of journey — use only the class, never fight it with inline style */
  if(t > 0.55){
    flipInner.style.transform = '';   /* clear inline so CSS class takes over */
    flipInner.classList.add('flipped');
  } else {
    flipInner.classList.remove('flipped');
    /* pre-flip tilt ramps up — only while not yet flipped */
    flipInner.style.transform = `rotateY(${et * 88}deg)`;
  }

  /* hide past about section */
  const pastAbout = sy > aboutTop + aboutH - 60;
  flipCard.style.opacity = pastAbout ? '0' : '1';
}

/* mouse 3D tilt in hero zone */
document.addEventListener('mousemove', e=>{
  if(isMobile() || !flipInner) return;
  if(window.scrollY > (heroSection?.offsetHeight || 0) * 0.35) return;
  if(flipInner.classList.contains('flipped')) return;

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  flipInner.style.transform =
    `perspective(900px) rotateY(${dx*12}deg) rotateX(${-dy*8}deg) translateZ(14px)`;
});

document.addEventListener('mouseleave',()=>{
  if(flipInner && !flipInner.classList.contains('flipped'))
    flipInner.style.transform = '';
});

window.addEventListener('scroll', onScroll, {passive:true});
window.addEventListener('resize', onScroll);
window.addEventListener('load', onScroll);


/* ══════════════════════════════════════════════
   MISSING HANDLERS — audit fix
══════════════════════════════════════════════ */

/* ── btn-work2: VIEW PROJECTS → scroll to #projects ── */
document.getElementById('btn-work2')?.addEventListener('click', () => {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
});

/* ── Hamburger → open/close mobile drawer ── */
const hamburgerBtn   = document.getElementById('hamburgerBtn');
const mobileDrawer   = document.getElementById('mobileDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');

function openDrawer() {
  if (mobileDrawer)   mobileDrawer.classList.add('open');
  if (drawerBackdrop) drawerBackdrop.classList.add('open');
  if (hamburgerBtn)   hamburgerBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  if (mobileDrawer)   mobileDrawer.classList.remove('open');
  if (drawerBackdrop) drawerBackdrop.classList.remove('open');
  if (hamburgerBtn)   hamburgerBtn.classList.remove('open');
  document.body.style.overflow = '';
}

hamburgerBtn?.addEventListener('click', () => {
  mobileDrawer?.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawerBackdrop?.addEventListener('click', closeDrawer);

/* ── Drawer links: smooth scroll + close drawer ── */
document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      closeDrawer();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── More Info toggle → expand contract-expandable ── */
const moreInfoBtn        = document.getElementById('moreInfoBtn');
const contractExpandable = document.getElementById('contractExpandable');
const moreInfoArrow      = document.getElementById('moreInfoArrow');

moreInfoBtn?.addEventListener('click', () => {
  const isOpen = contractExpandable?.classList.toggle('open');
  if (moreInfoBtn) moreInfoBtn.setAttribute('aria-expanded', String(!!isOpen));
  if (moreInfoArrow) {
    moreInfoArrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
  }
});

/* ── Player card (FIFA card) → open stats modal ── */
const aboutCardWrap = document.getElementById('aboutCardWrap');
const statsOverlay  = document.getElementById('statsOverlay');
const statsClose    = document.getElementById('statsClose');

function openStatsModal() {
  if (!statsOverlay) return;
  statsOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  /* animate stat counters */
  document.querySelectorAll('.av[data-val]').forEach(el => {
    const target = parseInt(el.dataset.val, 10);
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = cur;
    }, 20);
  });
  drawRadarChart();
}

function closeStatsModal() {
  if (!statsOverlay) return;
  statsOverlay.hidden = true;
  document.body.style.overflow = '';
}

aboutCardWrap?.addEventListener('click', openStatsModal);
statsClose?.addEventListener('click', closeStatsModal);
statsOverlay?.addEventListener('click', e => {
  if (e.target === statsOverlay) closeStatsModal();
});

/* ── Radar chart for stats modal ── */
function drawRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const labels    = ['PACE', 'VISION', 'DELIVERY', 'CREATIVITY', 'COMMUNICATION', 'TECHNIQUE'];
  const values    = [90, 92, 88, 85, 85, 95];
  const max       = 100;
  const cx        = canvas.width  / 2;
  const cy        = canvas.height / 2;
  const radius    = Math.min(cx, cy) - 30;
  const sides     = labels.length;
  const angleStep = (Math.PI * 2) / sides;
  const startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* grid rings */
  [0.25, 0.5, 0.75, 1].forEach(frac => {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = startAngle + i * angleStep;
      const x = cx + Math.cos(a) * radius * frac;
      const y = cy + Math.sin(a) * radius * frac;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(200,160,0,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  /* spokes */
  for (let i = 0; i < sides; i++) {
    const a = startAngle + i * angleStep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.strokeStyle = 'rgba(200,160,0,0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /* data polygon */
  ctx.beginPath();
  values.forEach((v, i) => {
    const a = startAngle + i * angleStep;
    const r = (v / max) * radius;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle   = 'rgba(200,160,0,0.25)';
  ctx.strokeStyle = '#c8a000';
  ctx.lineWidth   = 2;
  ctx.fill();
  ctx.stroke();

  /* labels */
  ctx.fillStyle    = '#fff';
  ctx.font         = 'bold 10px sans-serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  labels.forEach((lbl, i) => {
    const a = startAngle + i * angleStep;
    const x = cx + Math.cos(a) * (radius + 18);
    const y = cy + Math.sin(a) * (radius + 18);
    ctx.fillText(lbl, x, y);
  });
}

/* ── Enter Skills Arena ── */
const btnEnterArena   = document.getElementById('btnEnterArena');
const skillsArenaWrap = document.getElementById('skillsArenaWrap');
const skillsLanding   = document.getElementById('skillsLanding');

btnEnterArena?.addEventListener('click', () => {
  if (skillsArenaWrap) {
    skillsArenaWrap.style.display = '';
    skillsArenaWrap.classList.add('visible');
    skillsArenaWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (skillsLanding) skillsLanding.style.display = 'none';
});

/* ── Arena filter buttons ── */
document.querySelectorAll('.arena-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.arena-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.skill-ball').forEach(ball => {
      const cat = (ball.dataset.cat || '').trim();
      ball.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
    });
    document.querySelectorAll('.arena-group').forEach(group => {
      const title = (group.querySelector('.arena-group-title')?.textContent || '').trim();
      group.style.display = (filter === 'all' || title === filter) ? '' : 'none';
    });
  });
});

/* ── Project Carousel arrows ── */
const jerseyCarousel = document.getElementById('jerseyCarousel');
const carouselPrev   = document.getElementById('carouselPrev');
const carouselNext   = document.getElementById('carouselNext');

function getCarouselScrollAmount() {
  const card = jerseyCarousel?.querySelector('.jersey-card');
  return card ? card.offsetWidth + 16 : 280;
}

carouselPrev?.addEventListener('click', () => {
  jerseyCarousel?.scrollBy({ left: -getCarouselScrollAmount(), behavior: 'smooth' });
});
carouselNext?.addEventListener('click', () => {
  jerseyCarousel?.scrollBy({ left: getCarouselScrollAmount(), behavior: 'smooth' });
});

/* ── Jersey view buttons → open project detail panel ── */
const projDetailPanel = document.getElementById('projDetailPanel');

function openProjectDetail(card) {
  const data = card.querySelector('.proj-detail-data');
  if (!data || !projDetailPanel) return;

  const name     = data.dataset.name      || '';
  const desc     = data.dataset.desc      || '';
  const tags     = (data.dataset.tags     || '').split(',').filter(Boolean);
  const features = (data.dataset.features || '').split('|').filter(Boolean);
  const demo     = data.dataset.demo      || '#';
  const source   = data.dataset.source    || '#';
  const img      = data.dataset.img       || '';

  const el = id => document.getElementById(id);

  if (el('detailName'))   el('detailName').textContent  = name;
  if (el('detailDesc'))   el('detailDesc').textContent  = desc;
  if (el('detailDemo'))   el('detailDemo').href          = demo;
  if (el('detailSource')) el('detailSource').href        = source;

  const featList = el('detailFeatures');
  if (featList) featList.innerHTML = features.map(f => `<li>${f}</li>`).join('');

  const tagsEl = el('detailTags');
  if (tagsEl) tagsEl.innerHTML = tags.map(t => `<span>${t}</span>`).join('');

  const detailImg         = el('detailImg');
  const detailPlaceholder = el('detailPlaceholder');
  if (img && detailImg) {
    detailImg.src           = img;
    detailImg.style.display = '';
    if (detailPlaceholder) detailPlaceholder.style.display = 'none';
  } else {
    if (detailImg)          detailImg.style.display = 'none';
    if (detailPlaceholder)  detailPlaceholder.style.display = '';
  }

  projDetailPanel.hidden = false;
  projDetailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.querySelectorAll('.jersey-view-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.jersey-card');
    if (card) openProjectDetail(card);
  });
});

/* ── Hero nav links: smooth scroll ── */
document.querySelectorAll('.hero-nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Secondary nav links: smooth scroll ── */
document.querySelectorAll('.snav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Mobile bottom nav links: smooth scroll ── */
document.querySelectorAll('.mbn-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Active nav state via IntersectionObserver
   Covers .hero-nav-link, .snav-link, .mbn-link ── */
(function initActiveNav() {
  const allNavLinks = [
    ...document.querySelectorAll('.hero-nav-link'),
    ...document.querySelectorAll('.snav-link'),
    ...document.querySelectorAll('.mbn-link'),
  ];

  function setActive(sectionId) {
    allNavLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + sectionId) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  document.querySelectorAll('section[id]').forEach(sec => {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setActive(sec.id);
    }, { threshold: 0.35 }).observe(sec);
  });
})();

/* ══ HIDE ARENA BUTTON ══ */
(function(){
  const hideBtn     = document.getElementById('btnHideArena');
  const arenaWrap   = document.getElementById('skillsArenaWrap');
  const landing     = document.getElementById('skillsLanding');
  const enterBtn    = document.getElementById('btnEnterArena');
  if(!hideBtn) return;
  hideBtn.addEventListener('click',()=>{
    arenaWrap.classList.remove('visible');
    arenaWrap.style.display = 'none';
    if(landing){ landing.style.display = ''; }
    if(enterBtn){
      enterBtn.innerHTML = '<i class="fas fa-futbol"></i> Enter Skills Arena';
      enterBtn.style.cssText = '';
    }
    landing?.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();

/* ══ PROJECT CAROUSEL — mouse drag to scroll ══ */
(function(){
  const carousel = document.getElementById('jerseyCarousel');
  if(!carousel) return;
  let isDown = false, startX = 0, scrollLeft = 0;
  carousel.addEventListener('mousedown', e=>{
    isDown = true;
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', ()=>{ isDown=false; carousel.style.cursor='grab'; });
  carousel.addEventListener('mouseup',    ()=>{ isDown=false; carousel.style.cursor='grab'; });
  carousel.addEventListener('mousemove',  e=>{
    if(!isDown) return;
    e.preventDefault();
    const x    = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });
})();

/* ══ ABOUT — slide-in on scroll ══ */
(function(){
  const cardCol = document.querySelector('.about-card-col');
  const infoCol = document.querySelector('.about-info-col');
  if(!cardCol && !infoCol) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('slide-in');
    });
  },{threshold:0.15});
  if(cardCol) obs.observe(cardCol);
  if(infoCol) obs.observe(infoCol);
})();



/* ══ CONTACT + FOOTER PARALLAX OVER SKILLS ══
   Contact slides over skills only AFTER skills is fully scrolled past.
   Footer slides over contact the same way.
*/
(function(){
  const skillsSec  = document.getElementById('skills');
  const contactSec = document.getElementById('contact');
  const footer     = document.querySelector('.site-footer');
  if(!skillsSec || !contactSec) return;

  function update(){
    const sy  = window.scrollY;
    const vh  = window.innerHeight;

    /* ── Contact slides over skills ──
       Starts when bottom of skills reaches bottom of viewport.
       Ends when contact is fully in view. */
    const skillsBottom = skillsSec.offsetTop + skillsSec.offsetHeight;
    const contactH     = contactSec.offsetHeight;

    /* progress 0→1: 0 = skills just finished, 1 = contact fully visible */
    const cStart = skillsBottom - vh;          /* scroll Y when skills bottom hits viewport bottom */
    const cEnd   = skillsBottom;               /* scroll Y when skills bottom hits viewport top */
    const cProg  = Math.max(0, Math.min(1, (sy - cStart) / (cEnd - cStart)));

    /* contact slides up from 60px below its natural position */
    const cTY = (1 - cProg) * 60;
    contactSec.style.transform      = `translateY(${cTY}px)`;
    contactSec.style.transformOrigin = 'top center';

    /* ── Footer slides over contact ── */
    if(footer){
      const contactBottom = contactSec.offsetTop + contactSec.offsetHeight;
      const fStart = contactBottom - vh;
      const fEnd   = contactBottom;
      const fProg  = Math.max(0, Math.min(1, (sy - fStart) / (fEnd - fStart)));
      const fTY    = (1 - fProg) * 40;
      footer.style.transform      = `translateY(${fTY}px)`;
      footer.style.transformOrigin = 'top center';
    }
  }

  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
