const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => observer.observe(element));

const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const card = button.closest('.link-card');
    const link = card?.dataset.link;

    if (!link) {
      return;
    }

    const defaultLabel = button.textContent;

    try {
      await navigator.clipboard.writeText(link);
      button.textContent = 'Copied';
      button.classList.add('copied');
    } catch {
      button.textContent = 'Copy failed';
    }

    setTimeout(() => {
      button.textContent = defaultLabel;
      button.classList.remove('copied');
    }, 1400);
  });
});

const hero = document.querySelector('.hero');
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && supportsFinePointer && !prefersReducedMotion) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;

    hero.style.transform = `perspective(1000px) rotateX(${-y * 0.22}deg) rotateY(${x * 0.22}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    hero.style.transform = 'none';
  });
}
