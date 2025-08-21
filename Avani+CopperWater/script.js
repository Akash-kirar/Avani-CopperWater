/* =================== Interactivity JS =================== */
(function(){
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const drawer = document.getElementById('drawer');
  const hamburger = document.getElementById('hamburger');
  const closeDrawer = document.getElementById('closeDrawer');

  // Theme toggle
  function setTheme(theme){
    body.setAttribute('data-theme', theme);
    localStorage.setItem('avani_theme', theme);
  }
  const saved = localStorage.getItem('avani_theme');
  if(saved) setTheme(saved);
  themeToggle.addEventListener('click', ()=>{
    const now = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(now);
  });
  themeToggle.addEventListener('keypress', (e)=>{ if(e.key==='Enter') themeToggle.click(); });

  // Drawer toggle (changed here)
  hamburger.addEventListener('click', ()=>{
    const isOpen = drawer.classList.contains('open');
    if(isOpen){
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
    } else {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden','false');
    }
  });
  closeDrawer.addEventListener('click', ()=>{
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
  });
  // close when clicking outside panel
  drawer.addEventListener('click', (e)=>{
    if(e.target===drawer){
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
    }
  });

  // Drawer links
  document.querySelectorAll('[data-drawer]').forEach(a=>a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id=a.getAttribute('href').substring(1);
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  }));

  // Smooth nav links
  document.querySelectorAll('[data-nav]').forEach(a=>a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id=a.getAttribute('href').substring(1);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  }));

  // Simple in-view observer for animations
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in-view'); } });
  },{threshold:0.12});
  document.querySelectorAll('.fade-up, .slide-left, .feature-card, .card-sm').forEach(el=>io.observe(el));

  // sliding window: pause on hover
  document.querySelectorAll('.sliding-window').forEach(sw=>{
    sw.addEventListener('mouseenter', ()=>{
      const slides = sw.querySelector('.slides');
      slides.style.animationPlayState='paused';
    });
    sw.addEventListener('mouseleave', ()=>{
      const slides = sw.querySelector('.slides');
      slides.style.animationPlayState='running';
    });
  });

  // Open subpages from JS
  window.openSubpage = function(category, sub){
    const id = `subpage-${category}${sub?'-'+sub:''}`;
    const byId = document.getElementById(id);
    if(byId){ byId.classList.add('open'); return; }
    const map = {
      'about-team':'subpage-about','about-factory':'subpage-about-2',
      'contact-bulk':'subpage-contact-2'
    };
    if(map[`${category}-${sub}`]) document.getElementById(map[`${category}-${sub}`]).classList.add('open');
  }
  window.closeAllSubpages = function(){ document.querySelectorAll('.subpage').forEach(s=>s.classList.remove('open')); }

  // Scroll helper
  window.scrollToSection = function(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }

  // Responsive rearrangement behavior
  function arrangeFeatureCards(){
    document.querySelectorAll('.feature-card').forEach(fc=>{
      if(window.innerWidth<=520){
        fc.style.flexDirection='column';
      }else if(window.innerWidth<=880){
        fc.style.flexDirection='row';
      }else{
        fc.style.flexDirection='row';
      }
    });
  }
  arrangeFeatureCards();
  window.addEventListener('resize', arrangeFeatureCards);

  // Carousel small controls (if you want to add buttons later)
  document.addEventListener('keyup', (e)=>{
    if(e.key==='1') document.getElementById('home').scrollIntoView({behavior:'smooth'});
    if(e.key==='2') document.getElementById('about').scrollIntoView({behavior:'smooth'});
  });

  // External images alt fallback
  document.querySelectorAll('img').forEach(img=>{
    if(!img.getAttribute('alt')) img.setAttribute('alt','Avani product image');
  });

  // Ensure hamburger visibility based on width
  function updateHamburger(){
    const hb = document.getElementById('hamburger');
    if(window.innerWidth<=519) hb.style.display='flex'; else hb.style.display='none';
  }
  updateHamburger(); 
  window.addEventListener('resize', updateHamburger);

  // Lazy-load images
  if('loading' in HTMLImageElement.prototype){
    document.querySelectorAll('img').forEach(i=>i.setAttribute('loading','lazy'));
  }

  // Trap focus in subpages
  document.querySelectorAll('.subpage').forEach(sp=>{
    sp.addEventListener('keydown', (e)=>{
      if(e.key==='Escape') sp.classList.remove('open');
    });
    sp.addEventListener('click', (ev)=>{
      if(ev.target===sp) sp.classList.remove('open');
    });
  });

})();

// Sliding window: true infinite right-to-left, pause on hover/touch
document.querySelectorAll('.sliding-window').forEach(sw => {
  const slides = sw.querySelector('.slides');

  // Duplicate slides for infinite scroll
  slides.innerHTML += slides.innerHTML;

  let speed = 1; // pixels per frame
  let pos = 0;
  let paused = false;

  function animate() {
    if (!paused) {
      pos -= speed;
      if (Math.abs(pos) >= slides.scrollWidth / 2) {
        pos = 0; // reset without visible jump
      }
      slides.style.transform = `translateX(${pos}px)`;
    }
    requestAnimationFrame(animate);
  }

  animate();

  // Pause on hover (desktop)
  sw.addEventListener('mouseenter', () => paused = true);
  sw.addEventListener('mouseleave', () => paused = false);

  // Pause on touch (mobile)
  sw.addEventListener('touchstart', () => paused = true, { passive: true });
  sw.addEventListener('touchend', () => paused = false);
});
