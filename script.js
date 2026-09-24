const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
document.body.classList.add('palette-light');

const canUseCustomCursor = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canUseCustomCursor) {
  const cursorDot = document.createElement('span');
  const cursorRing = document.createElement('span');
  cursorDot.className = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  cursorDot.setAttribute('aria-hidden', 'true');
  cursorRing.setAttribute('aria-hidden', 'true');
  document.body.append(cursorDot, cursorRing);

  let pointerX = -100;
  let pointerY = -100;
  let ringX = pointerX;
  let ringY = pointerY;
  let cursorVisible = false;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorVisible = true;
    document.body.classList.add('custom-cursor-active');
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    cursorVisible = false;
    document.body.classList.remove('custom-cursor-active');
  });

  document.querySelectorAll('a, button, input, textarea, .tilt-card').forEach((element) => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  const animateCursor = () => {
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    cursorDot.style.opacity = cursorVisible ? '1' : '0';
    cursorRing.style.opacity = cursorVisible ? '1' : '0';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
}

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 35, 240)}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 760) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const strength = Number(card.dataset.tilt || 5);
    card.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

const heroOrbit = document.querySelector('.hero-orbit');
window.addEventListener('scroll', () => {
  if (heroOrbit && window.innerWidth > 760) {
    heroOrbit.style.translate = `0 ${Math.min(window.scrollY * 0.08, 34)}px`;
  }
}, { passive: true });

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !message) {
    formStatus.textContent = 'Please complete all fields.';
    formStatus.style.color = '#ff8b8b';
    return;
  }
  if (!emailIsValid) {
    formStatus.textContent = 'Please enter a valid email address.';
    formStatus.style.color = '#ff8b8b';
    return;
  }
  formStatus.textContent = 'Thanks. Your message is ready to send.';
  formStatus.style.color = 'var(--lime)';
  form.reset();
});
