document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Cascata: grupos que revelam item a item, em vez de bloco único ──
  // (cada grupo aponta pro seletor dos filhos diretos que devem ganhar o delay)
  const staggerGroups = [
    { group: '.plates',         items: '.plate',       step: 70,  max: 350 },
    { group: '.areas',          items: '.areas__row',  step: 80,  max: 240 },
    { group: '.misc',           items: ':scope > li',  step: 50,  max: 350 },
    { group: '.contact__links', items: '.btn',          step: 60,  max: 240 },
  ];

  staggerGroups.forEach(({ group, items, max, step }) => {
    const groupEl = document.querySelector(group);
    if (!groupEl) return;
    groupEl.classList.remove('reveal', 'visible');
    groupEl.querySelectorAll(items).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i * step, max) + 'ms';
    });
  });

  // ── Reveal on scroll ────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ── Spotlight seguindo o cursor nos cards de projeto ─────
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.plate').forEach(plate => {
      plate.addEventListener('mousemove', (e) => {
        const rect = plate.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        plate.style.setProperty('--mx', x + '%');
        plate.style.setProperty('--my', y + '%');
      });
    });
  }

});
