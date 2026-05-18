// ── Nav: sticky scroll effect ──────────────────────────────
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Nav: burger menu ───────────────────────────────────────
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('active', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── Era cards: IntersectionObserver fade-in ─────────────────
const eras = document.querySelectorAll('.era');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

eras.forEach(era => observer.observe(era));

// ── Gallery: lightbox ──────────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery__item');

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <div class="lightbox__backdrop"></div>
  <div class="lightbox__inner">
    <img class="lightbox__img" src="" alt="" />
    <div class="lightbox__meta">
      <span class="lightbox__name"></span>
      <span class="lightbox__year"></span>
    </div>
    <button class="lightbox__close" aria-label="Закрыть">✕</button>
    <button class="lightbox__prev" aria-label="Назад">‹</button>
    <button class="lightbox__next" aria-label="Вперёд">›</button>
  </div>
`;
document.body.appendChild(lightbox);

// Inject lightbox styles
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .lightbox.active {
    opacity: 1;
    pointer-events: all;
  }
  .lightbox__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.92);
    cursor: zoom-out;
  }
  .lightbox__inner {
    position: relative;
    max-width: min(90vw, 1100px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .lightbox__img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    display: block;
    border: 1px solid rgba(200,169,110,0.2);
  }
  .lightbox__meta {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0 0;
    color: #f5f4f0;
    align-items: baseline;
  }
  .lightbox__name {
    font-family: Georgia, serif;
    font-size: 1rem;
    font-style: italic;
  }
  .lightbox__year {
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #c8a96e;
  }
  .lightbox__close {
    position: absolute;
    top: -2.5rem; right: 0;
    background: none;
    border: none;
    color: rgba(245,244,240,0.5);
    font-size: 1.4rem;
    cursor: pointer;
    transition: color 0.2s;
  }
  .lightbox__close:hover { color: #c8a96e; }
  .lightbox__prev,
  .lightbox__next {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(245,244,240,0.4);
    font-size: 3rem;
    cursor: pointer;
    padding: 0.5rem 1.2rem;
    transition: color 0.2s;
    line-height: 1;
  }
  .lightbox__prev { left: 1.5rem; }
  .lightbox__next { right: 1.5rem; }
  .lightbox__prev:hover,
  .lightbox__next:hover { color: #c8a96e; }
`;
document.head.appendChild(lbStyle);

let currentIndex = 0;
const items = Array.from(galleryItems);

function openLightbox(index) {
  currentIndex = index;
  const item = items[index];
  const img = item.querySelector('img');
  const name = item.querySelector('.gallery__name')?.textContent || '';
  const year = item.querySelector('.gallery__year')?.textContent || '';

  lightbox.querySelector('.lightbox__img').src = img.src;
  lightbox.querySelector('.lightbox__img').alt = img.alt;
  lightbox.querySelector('.lightbox__name').textContent = name;
  lightbox.querySelector('.lightbox__year').textContent = year;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + items.length) % items.length;
  openLightbox(currentIndex);
}

items.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox__prev').addEventListener('click', () => navigate(-1));
lightbox.querySelector('.lightbox__next').addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});


// ── Quote section: fade on scroll ─────────────────────────
const quoteContent = document.querySelector('.quote__content');

if (quoteContent) {
  const quoteObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) quoteContent.style.animation = 'fadeUp 1s ease both';
  }, { threshold: 0.3 });
  quoteObserver.observe(quoteContent);
}
