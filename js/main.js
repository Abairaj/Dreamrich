(() => {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const links = [...nav.querySelectorAll('.nav__link')];

  // Solid header once the page is scrolled
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  links.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  // Highlight the nav link for the section in view
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) =>
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((section) => spy.observe(section));

  // Reveal on scroll
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  // Enquiry form: no backend, so hand the message to the visitor's mail client
  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = 'Please fill in your name, contact details and message.';
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const body = [
      `Name: ${data.get('name')}`,
      `Company: ${data.get('company') || '-'}`,
      `Email / Phone: ${data.get('contact')}`,
      '',
      data.get('message'),
    ].join('\n');
    window.location.href = 'mailto:info@dreamrichassociates.com'
      + `?subject=${encodeURIComponent(`Enquiry from ${data.get('name')}`)}`
      + `&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app to send the enquiry…';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
