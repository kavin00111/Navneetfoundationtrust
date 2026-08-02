document.addEventListener('DOMContentLoaded', function(){

  if (window.lucide) { lucide.createIcons(); } else { window.addEventListener('load', function(){ if(window.lucide) lucide.createIcons(); }); }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky navbar ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll(){
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var backdrop = document.getElementById('menuBackdrop');
  function closeMenu(){
    navbar.classList.remove('menu-open');
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  function toggleMenu(){
    var isOpen = mobileMenu.classList.contains('open');
    if (isOpen) { closeMenu(); }
    else {
      navbar.classList.add('menu-open');
      mobileMenu.classList.add('open');
      backdrop.classList.add('open');
      hamburger.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
    }
  }
  hamburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  } else {
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold:.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  }

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el){
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var countSpan = el.querySelector('.count');
    var duration = 1600, start = null;
    function step(ts){
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      countSpan.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else countSpan.textContent = target;
    }
    if (reduceMotion) { countSpan.textContent = target; return; }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
      });
    }, { threshold:.5 });
    counters.forEach(function(el){ counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Button ripple-of-kindness press effect ---------- */
  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      if (reduceMotion) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 1.4;
      var span = document.createElement('span');
      span.className = 'ripple-hit';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size/2) + 'px';
      span.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(span);
      setTimeout(function(){ span.remove(); }, 650);
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxMedia = document.getElementById('lightboxMedia');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxDesc = document.getElementById('lightboxDesc');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;

  document.querySelectorAll('.gallery-item').forEach(function(item){
    item.addEventListener('click', function(){
      var isVideo = item.getAttribute('data-video') === 'true';
      if (isVideo) {
        var videoEl = item.querySelector('video');
        var vsrc = videoEl ? (videoEl.currentSrc || videoEl.getAttribute('src')) : '';
        lightboxMedia.innerHTML = vsrc
          ? '<video src="' + vsrc + '" controls autoplay playsinline></video>'
          : '<i data-lucide="play-circle" style="width:44px;height:44px;"></i>';
      } else {
        var imgEl = item.querySelector('img');
        lightboxMedia.innerHTML = imgEl
          ? '<img src="' + imgEl.src + '" alt="' + (imgEl.alt || '') + '">'
          : '<i data-lucide="image" style="width:44px;height:44px;"></i>';
      }
      lightboxTitle.textContent = item.getAttribute('data-title') || 'Untitled';
      lightboxDesc.textContent = item.getAttribute('data-desc') || '';
      lastFocused = document.activeElement;
      lightbox.classList.add('open');
      if (window.lucide) lucide.createIcons();
      lightboxClose.focus();
    });
  });
  function closeLightbox(){
    lightbox.classList.remove('open');
    var openVideo = lightboxMedia.querySelector('video');
    if (openVideo) { openVideo.pause(); }
    if (lastFocused) lastFocused.focus();
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (item.classList.contains('open')) { a.style.maxHeight = a.scrollHeight + 'px'; }
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(other){
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded','false');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open'); q.setAttribute('aria-expanded','false'); a.style.maxHeight = null;
      } else {
        item.classList.add('open'); q.setAttribute('aria-expanded','true'); a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Forms (client-side only — wire to your backend / email service) ---------- */
  function handleForm(formId, successId, resetId){
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    var resetBtn = document.getElementById(resetId);
    if (!form || !success || !resetBtn) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // TODO: replace with a real submission, e.g.
      // fetch('/api/submit', { method:'POST', body:new FormData(form) });
      form.style.display = 'none';
      success.classList.add('show');
      if (window.lucide) lucide.createIcons();
    });
    resetBtn.addEventListener('click', function(){
      form.reset();
      form.style.display = 'block';
      success.classList.remove('show');
    });
  }
  handleForm('donateForm', 'donateSuccess', 'donateReset');
  handleForm('contactForm', 'contactSuccess', 'contactReset');

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
