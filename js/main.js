/* ===================================================================
   KAVYA ARTFOLIO — GSAP Animations & Interactions
   =================================================================== */

gsap.registerPlugin(ScrollTrigger);

// ===== Utility: Split text into individual characters =====
function splitTextIntoChars(element) {
  const text = element.textContent.trim();
  element.textContent = '';
  element.setAttribute('aria-label', text);

  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    element.appendChild(span);
  });

  return element.querySelectorAll('.char');
}

// ===== Custom Cursor =====
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
    follower.classList.add('visible');
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, overwrite: true });
  });

  // Smooth follower with GSAP ticker
  gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, { x: followerX, y: followerY });
  });

  // Expand on hoverable elements
  const hoverTargets = document.querySelectorAll('a, button, .card, .runway-card, .footer-email');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
  });
}

// ===== Preloader =====
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const brand = document.querySelector('.preloader-brand');
  const line = document.querySelector('.preloader-line');
  const counter = document.getElementById('preloader-count');

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.classList.add('loaded');
      initHero();
      initMarquee();
      initCollections();
      initRunway();
      initAbout();
      initFooter();
      initNavScroll();
    }
  });

  // Counter
  const countObj = { val: 0 };
  tl.to(countObj, {
    val: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => { counter.textContent = Math.floor(countObj.val); }
  }, 0);

  // Gold line expands
  tl.to(line, {
    width: '140px',
    duration: 1.8,
    ease: 'power2.inOut'
  }, 0);

  // Brand text slides up
  tl.to(brand, {
    y: 0,
    duration: 1.1,
    ease: 'power3.out'
  }, 0.4);

  // Hold
  tl.to({}, { duration: 0.5 });

  // Exit: curtain slides up
  tl.to(preloader, {
    yPercent: -100,
    duration: 1,
    ease: 'power3.inOut'
  });

  tl.set(preloader, { display: 'none' });
}

// ===== Hero Animations =====
function initHero() {
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  const tagline = document.querySelector('.hero-tagline');
  const imageInner = document.querySelector('.hero-image-inner');
  const scrollInd = document.querySelector('.hero-scroll');
  const heroLine = document.querySelector('.hero-line');

  // Make elements visible
  [title, subtitle, tagline, imageInner, scrollInd, heroLine].forEach(el => {
    if (el) el.style.visibility = 'visible';
  });

  const titleChars = splitTextIntoChars(title);
  const tl = gsap.timeline({ delay: 0.15 });

  // Title characters stagger in with rotation
  tl.from(titleChars, {
    y: 100,
    rotateX: -90,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.07
  });

  // Subtitle slides up
  tl.from(subtitle, {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  }, '-=0.6');

  // Tagline
  tl.from(tagline, {
    y: 25,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.5');

  // Gold line
  tl.from(heroLine, {
    scaleX: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.4');

  // Image: diagonal clip-path reveal (like fabric draping)
  tl.from(imageInner, {
    clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
    duration: 1.4,
    ease: 'power3.inOut'
  }, '-=1.2');

  // Scroll indicator
  tl.from(scrollInd, {
    opacity: 0,
    y: 15,
    duration: 0.7,
    ease: 'power2.out'
  }, '-=0.3');

  // --- Scroll-based parallax ---
  gsap.to('.hero-image-wrap', {
    y: 120,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // Fade hero text on scroll
  gsap.to('.hero-text', {
    opacity: 0,
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '40% top',
      end: 'bottom top',
      scrub: 1
    }
  });
}

// ===== Marquee =====
function initMarquee() {
  // Duplicate marquee content for seamless loop
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });
}

// ===== Collections =====
function initCollections() {
  // Section header animation
  const sectionTitle = document.querySelector('.collections .section-title');
  const sectionLabel = document.querySelector('.collections .section-label');

  if (sectionLabel) {
    gsap.from(sectionLabel, {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.collections .section-header',
        start: 'top 85%'
      }
    });
  }

  if (sectionTitle) {
    const chars = splitTextIntoChars(sectionTitle);
    gsap.from(chars, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.025,
      scrollTrigger: {
        trigger: '.collections .section-header',
        start: 'top 80%'
      }
    });
  }

  // Card reveals with diagonal clip-path (saree drape effect)
  const revealItems = document.querySelectorAll('.collections .reveal-item');

  revealItems.forEach(item => {
    const cardImage = item.querySelector('.card-image');
    const cardInfo = item.querySelector('.card-info');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    // Diagonal clip-path reveal mimicking fabric draping
    tl.to(cardImage, {
      clipPath: 'polygon(0 0, 115% 0, 100% 100%, 0 100%)',
      duration: 1.4,
      ease: 'power3.inOut'
    });

    // Info slides up
    tl.from(cardInfo, {
      y: 25,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4');
  });
}

// ===== Runway (Horizontal Scroll) =====
function initRunway() {
  const track = document.getElementById('runwayTrack');
  if (!track) return;

  // Section header
  const runwayLabel = document.querySelector('.runway .section-label');
  const runwayTitle = document.querySelector('.runway .section-title');

  if (runwayLabel) {
    gsap.from(runwayLabel, {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.runway-header',
        start: 'top 85%'
      }
    });
  }

  if (runwayTitle) {
    const chars = splitTextIntoChars(runwayTitle);
    gsap.from(chars, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.025,
      scrollTrigger: {
        trigger: '.runway-header',
        start: 'top 80%'
      }
    });
  }

  // Horizontal scroll with pin
  const getScrollDistance = () => -(track.scrollWidth - window.innerWidth + 60);

  gsap.to(track, {
    x: getScrollDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: '.runway',
      start: 'top top',
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true,
      anticipatePin: 1
    }
  });
}

// ===== About =====
function initAbout() {
  // Title
  const aboutTitle = document.querySelector('.about-title');
  const aboutLabel = document.querySelector('.about .section-label');

  if (aboutLabel) {
    gsap.from(aboutLabel, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: { trigger: '.about-content', start: 'top 80%' }
    });
  }

  if (aboutTitle) {
    const chars = splitTextIntoChars(aboutTitle);
    gsap.from(chars, {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.04,
      scrollTrigger: { trigger: '.about-content', start: 'top 75%' }
    });
  }

  // Image reveal (bottom-up curtain)
  const frame = document.querySelector('.about-image-frame');
  if (frame) {
    gsap.from(frame, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      duration: 1.3,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: '.about-image-wrap', start: 'top 78%' }
    });
  }

  // Caption
  const caption = document.querySelector('.about-image-caption');
  if (caption) {
    gsap.from(caption, {
      y: 15,
      opacity: 0,
      duration: 0.6,
      delay: 0.4,
      scrollTrigger: { trigger: '.about-image-wrap', start: 'top 75%' }
    });
  }

  // Text paragraphs stagger
  const paras = document.querySelectorAll('.about-text p');
  gsap.from(paras, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.2,
    scrollTrigger: { trigger: '.about-text', start: 'top 82%' }
  });

  // Stats
  const stats = document.querySelectorAll('.stat');
  gsap.from(stats, {
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.about-stats', start: 'top 90%' }
  });
}

// ===== Footer =====
function initFooter() {
  const footerTitle = document.querySelector('.footer-title');

  if (footerTitle) {
    const chars = splitTextIntoChars(footerTitle);
    gsap.from(chars, {
      y: 45,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.02,
      scrollTrigger: { trigger: '.footer-cta', start: 'top 82%' }
    });
  }

  gsap.from('.footer-subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    scrollTrigger: { trigger: '.footer-cta', start: 'top 78%' }
  });

  gsap.from('.footer-email', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    scrollTrigger: { trigger: '.footer-cta', start: 'top 75%' }
  });

  gsap.from('.footer-bottom', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%' }
  });
}

// ===== Navigation Scroll Behavior =====
function initNavScroll() {
  const header = document.getElementById('header');

  // Add/remove scrolled class
  ScrollTrigger.create({
    start: 80,
    onUpdate: self => {
      header.classList.toggle('scrolled', self.scroll() > 80);
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        // Close mobile menu if open
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      menu.classList.add('open');
      btn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('menuBtn');
  if (menu) menu.classList.remove('open');
  if (btn) btn.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMobileMenu();
  initPreloader();
});

// Refresh ScrollTrigger on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});
