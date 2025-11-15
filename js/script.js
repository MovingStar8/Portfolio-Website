// Enhanced JS: smooth nav scrolling, section reveal and scroll-spy
document.addEventListener('DOMContentLoaded', function(){
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });

  // Mobile nav toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const topnav = document.querySelector('.topnav');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  let lastFocused = null;

  function openMobileMenu(){
    if(!mobileMenu) return;
    lastFocused = document.activeElement;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden','false');
    if(mobileToggle){
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded','true');
    }
    document.documentElement.style.overflow = 'hidden';
    // focus first focusable element inside menu
    const focusable = getFocusable(mobileMenu);
    if(focusable.length) focusable[0].focus();
    // attach key listener for focus trap
    document.addEventListener('keydown', onKeyDown);
  }

  function closeMobileMenu(){
    if(!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden','true');
    if(mobileToggle){
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded','false');
    }
    document.documentElement.style.overflow = '';
    // remove key listener
    document.removeEventListener('keydown', onKeyDown);
    // restore focus
    if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  if(mobileToggle){
    mobileToggle.addEventListener('click', ()=>{
      if(mobileMenu && mobileMenu.classList.contains('open')) closeMobileMenu(); else openMobileMenu();
    });
  }

  if(mobileClose){
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // close when clicking any mobile menu link
  document.querySelectorAll('.mobile-menu-list a').forEach(a=>{
    a.addEventListener('click', closeMobileMenu);
  });

  // helper: get focusable elements within an element
  function getFocusable(root){
    return Array.from(root.querySelectorAll('a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  // keyboard handler to trap focus and close on Escape
  function onKeyDown(e){
    if(!mobileMenu || !mobileMenu.classList.contains('open')) return;
    if(e.key === 'Escape' || e.key === 'Esc'){
      e.preventDefault();
      closeMobileMenu();
      return;
    }
    if(e.key === 'Tab'){
      const focusable = getFocusable(mobileMenu);
      if(focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(e.shiftKey){
        if(document.activeElement === first){
          e.preventDefault();
          last.focus();
        }
      } else {
        if(document.activeElement === last){
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  // Scroll spy: highlight active nav link
  const navLinks = document.querySelectorAll('.topnav a');
  const sections = Array.from(document.querySelectorAll('main .section'));

  function updateActive(){
    const fromTop = window.scrollY + 120;
    let current = sections[0];
    for(const sec of sections){
      if(sec.offsetTop <= fromTop) current = sec;
    }
    navLinks.forEach(l=> l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
  }
  updateActive();
  window.addEventListener('scroll', throttle(updateActive, 150));

  // Reveal sections when in view
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.section').forEach(s=>{
    s.classList.add('reveal');
    observer.observe(s);
  });

  // small throttle helper
  function throttle(fn, wait){
    let last = 0;
    return function(...args){
      const now = Date.now();
      if(now - last >= wait){
        last = now;
        fn.apply(this, args);
      }
    };
  }
});
