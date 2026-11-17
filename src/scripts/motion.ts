import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = !!(navigator as any).connection?.saveData;

export function boot() {
  gsap.registerPlugin(ScrollTrigger);
  requestAnimationFrame(() => document.documentElement.classList.add('ready'));

  // ---------- nav ----------
  const nav = document.getElementById('nav')!;
  const menuBtn = nav.querySelector<HTMLButtonElement>('.menu-btn')!;
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > lastY && y > 600 && !nav.classList.contains('open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    
  }
  menuBtn.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', closeMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuBtn.focus(); } });

  // ---------- English | Desi ----------
  const root = document.documentElement;
  const swap = (on: boolean) => {
    root.dataset.desi = on ? 'on' : 'off';
    document.querySelectorAll<HTMLElement>('[data-desi-text]').forEach((el) => {
      if (!el.dataset.enText) el.dataset.enText = el.innerHTML;
      el.innerHTML = on ? el.dataset.desiText! : el.dataset.enText;
    });
    document.querySelectorAll<HTMLButtonElement>('.lang button').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.lang === 'on') === on)));
    try { localStorage.setItem('chhat-desi', on ? 'on' : 'off'); } catch {}
  };
  document.querySelectorAll<HTMLButtonElement>('.lang button').forEach((b) => b.addEventListener('click', () => swap(b.dataset.lang === 'on')));
  if (root.dataset.desi === 'on') swap(true);

  // ---------- count-ups ----------
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count!);
    const suffix = el.dataset.suffix ?? '';
    if (reduce) return;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v) + suffix) }),
    });
  });

  // ---------- videos play only on screen ----------
  const vids = document.querySelectorAll<HTMLVideoElement>('video[data-auto]');
  const vio = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      const v = en.target as HTMLVideoElement;
      if (en.isIntersecting) {
        if (saveData) return;
        if (!v.src && v.dataset.src) { v.src = v.dataset.src; }
        if (!reduce && !saveData) v.play().catch(() => {});
      } else v.pause();
    });
  }, { rootMargin: '200px 0px' });
  vids.forEach((v) => vio.observe(v));

  // ---------- hero cards turn over ----------
  document.querySelectorAll<HTMLButtonElement>('.hcard').forEach((c) => {
    c.addEventListener('click', () => c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')));
  });

  // ---------- magnetic primary buttons ----------
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((b) => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  // ---------- trailer dialog ----------
  const dlg = document.getElementById('trailer') as HTMLDialogElement | null;
  if (dlg) {
    const v = dlg.querySelector('video')!;
    document.querySelectorAll('[data-trailer]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      if (!v.src) v.src = v.dataset.src!;
      dlg.showModal(); 
      v.currentTime = 0; v.play().catch(() => {});
    }));
    const close = () => { v.pause(); dlg.close(); };
    dlg.querySelector('.dlg-close')!.addEventListener('click', close);
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
    dlg.addEventListener('close', () => { v.pause();  });
  }

  // ---------- the 3D hero ----------
  const gl = document.getElementById('hero-gl');
  if (gl && !saveData) {
    const hud = document.getElementById('hero-hud');
    const start = () => import('./hero3d').then(({ mountHero }) => {
      mountHero(gl, {
        onScore: (n, state) => {
          if (!hud) return;
          hud.dataset.state = state;
          const desi = root.dataset.desi === 'on';
          if (state === 'fall') hud.textContent = desi ? `Arre! ${n} chhat. Phir se tap karo` : `Missed! ${n} roofs. Tap to go again`;
          else hud.textContent = desi ? `${n} chhat paar` : `${n} roofs cleared`;
        },
      });
    });
    if ('requestIdleCallback' in window) (window as any).requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 300);
  }
}
