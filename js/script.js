const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const yearNode = document.querySelector('[data-year]');
const faqItems = document.querySelectorAll('.faq-item');
const revealNodes = document.querySelectorAll('.reveal');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const toggleNav = () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
};

if (navToggle && siteNav) {
  navToggle.addEventListener('click', toggleNav);

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    header?.classList.add('site-header--scrolled');
  } else {
    header?.classList.remove('site-header--scrolled');
  }
});

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-item__question');

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    faqItems.forEach((faq) => {
      faq.classList.remove('is-open');
      faq.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealNodes.forEach((node) => observer.observe(node));
