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
