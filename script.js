/* EmailJS init - preserves your existing key */
(function(){
  if(window.emailjs) emailjs.init("ouwThvw_yAzbu5L4Z");
})();

/* Send mail (unchanged behaviour) */
const sendBtn = document.getElementById('sendBtn');
if(sendBtn){
  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    if(!name || !email || !subject || !message){ alert('Please fill all necessary informations'); return; }
    const params = { name, email, subject, message };
    emailjs.send("service_npx2skm","template_9e8ybuo",params)
      .then(() => alert('email sent'))
      .catch(() => alert('Failed to send. Check network or EmailJS config.'));
  });
}

/* Smooth scroll buttons */
document.getElementById('btn-work')?.addEventListener('click', ()=> document.getElementById('projects').scrollIntoView({behavior:'smooth'}));
document.getElementById('btn-contact')?.addEventListener('click', ()=> document.getElementById('contact').scrollIntoView({behavior:'smooth'}));
document.getElementById("downloadBtn").addEventListener("click", function() {

  const fileURL = "MY_CV .docx";

  // Create an invisible link element
  const link = document.createElement("a");
  link.href = fileURL; 
  link.download = "MY_CV .docx";
  

  // Open the file in a new browser tab
  window.open(fileURL, "_blank");
});

/* Active nav highlighting via IntersectionObserver */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a=> a.classList.remove('active'));
      const matching = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if(matching) matching.classList.add('active');
    }
  });
}, {threshold: 0.6});

sections.forEach(s => observer.observe(s));

/* Theme toggle (persist in localStorage) */
/* ✅ Theme toggle using body.light-mode and localStorage */
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Apply saved theme
if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// Toggle theme on click
themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light-mode");

  if (body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});


/* Skills animation using IntersectionObserver (animate once) */
const skillsSection = document.getElementById('skills');
if(skillsSection){
  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const liquids = document.querySelectorAll('.liquid');
        liquids.forEach(liq => {
          const target = parseInt(liq.getAttribute('data-target')||'0',10);
          let current = 0;
          const textEl = liq.parentElement.querySelector('.percentage-text');
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            current += step;
            if(current >= target){ current = target; clearInterval(timer); }
            liq.style.width = current + '%';
            if(textEl) textEl.textContent = current + '%';
          }, 18);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.35});
  skillObserver.observe(skillsSection);
}
