/**
 * SIGNAL — Abhinav's Personal Portfolio
 * Core Client Interactions & Scroll Motion
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initActiveNav();
  initMobileNav();
  initCopyEmail();
  initCardSpotlights();
});

/**
 * 1. Intersection Observer for Scroll Reveals
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-init');

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 2. Active Nav Link on Scroll
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/**
 * 3. Mobile Navigation Drawer Toggle
 */
function initMobileNav() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!toggleBtn || !header) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is tapped
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 4. Copy Email to Clipboard with Toast Notification
 */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastText');

  if (!copyBtns.length) return;

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'abhinavkumarinsights@gmail.com';

      try {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        // Fallback for environments where clipboard API is blocked
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showToast('Email address copied to clipboard!');
        } catch (e2) {
          window.location.href = `mailto:${email}`;
        }
        document.body.removeChild(textArea);
      }
    });
  });

  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;

    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }
}

/**
 * 5. Subtle Card Spotlight Glow on Mouse Movement
 */
function initCardSpotlights() {
  // Only activate on devices with fine pointer (mouse)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = document.querySelectorAll('.project-card-featured, .fragment-card, .voice-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
