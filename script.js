(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const photo = document.getElementById('background-photo');
  const credit = document.getElementById('photo-credit');
  // Published settings only; no visitor editor or upload controls.
  if (typeof config.background === 'string' && /^(?:assets\/[\w./-]+|https:\/\/images\.unsplash\.com\/photo-[\w-]+(?:\?[^#\s]*)?)$/.test(config.background)) photo.src = config.background;
  photo.srcset = typeof config.srcset === 'string' ? config.srcset : '';
  if (typeof config.sizes === 'string') photo.sizes = config.sizes;
  if (typeof config.alt === 'string') photo.alt = config.alt;
  const x = Number(config.positionX);
  if (Number.isFinite(x)) photo.style.objectPosition = `${Math.max(0, Math.min(100, x))}% center`;
  if (config.credit) {
    const label = credit.querySelector('span');
    const link = credit.querySelector('a');
    label.textContent = config.credit.subject || '';
    link.textContent = `${config.credit.photographer || ''} / Unsplash ↗`;
    if (/^https:\/\//.test(config.credit.url || '')) link.href = config.credit.url;
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
