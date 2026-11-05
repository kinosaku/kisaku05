(() => {
  'use strict';
  const photo = document.getElementById('background-photo');
  const credit = document.getElementById('photo-credit');
  const dialog = document.getElementById('appearance-dialog');
  const position = document.getElementById('photo-position');
  const positionValue = document.getElementById('position-value');
  const status = document.getElementById('appearance-status');
  const picker = document.getElementById('background-file');
  const defaultConfig = { ...window.SITE_CONFIG };
  const storageKey = 'kisaku05:appearance:v1';
  let current = { ...defaultConfig };
  let loadSequence = 0;

  const validPhoto = value => typeof value === 'string' && (/^data:image\/(?:webp|jpeg|png);base64,/.test(value) || /^assets\/[\w./-]+$/.test(value) || /^https:\/\//.test(value));
  const normalize = value => ({
    ...defaultConfig,
    ...value,
    background: validPhoto(value.background) ? value.background : defaultConfig.background,
    position: Number.isFinite(Number(value.position)) ? Math.max(0, Math.min(100, Number(value.position))) : 50,
  });

  const apply = () => {
    const sequence = ++loadSequence;
    photo.onload = () => { if (sequence === loadSequence) photo.classList.add('loaded'); };
    photo.onerror = () => {
      if (sequence !== loadSequence || photo.getAttribute('src') === defaultConfig.background) return;
      photo.src = defaultConfig.background;
      photo.alt = defaultConfig.alt;
      status.textContent = '照片加载失败，已显示默认背景。';
    };
    photo.src = current.background;
    photo.alt = current.alt || '自选背景照片';
    photo.style.objectPosition = `center ${current.position}%`;
    position.value = String(current.position);
    positionValue.value = `${current.position}%`;
    credit.replaceChildren();
    if (current.credit?.photographer) {
      const subject = document.createElement('span');
      subject.textContent = current.credit.subject || '';
      const attribution = document.createElement('a');
      attribution.textContent = `Photograph by ${current.credit.photographer} ↗`;
      attribution.href = /^https:\/\//.test(current.credit.url || '') ? current.credit.url : '#';
      attribution.target = '_blank';
      attribution.rel = 'noopener noreferrer';
      credit.append(subject, attribution);
    }
    credit.hidden = !current.credit?.photographer;
  };

  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(current)); return true; }
    catch { status.textContent = '已预览照片；当前浏览器无法保存设置，你仍可下载设置。'; return false; }
  };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') current = normalize(saved);
  } catch { /* The published background remains available when storage is disabled. */ }
  apply();
  document.getElementById('year').textContent = String(new Date().getFullYear());
  document.getElementById('appearance-toggle').addEventListener('click', () => dialog.showModal());
  document.getElementById('close-appearance').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });

  position.addEventListener('input', () => {
    current.position = Number(position.value);
    photo.style.objectPosition = `center ${current.position}%`;
    positionValue.value = `${current.position}%`;
    persist();
  });

  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      status.textContent = '请选择 JPG、PNG 或 WebP 照片。'; picker.value = ''; return;
    }
    if (file.size > 20 * 1024 * 1024) {
      status.textContent = '请选择小于 20 MB 的照片。'; picker.value = ''; return;
    }
    status.textContent = '正在准备照片…';
    const localUrl = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = localUrl;
      await image.decode();
      const scale = Math.min(1, 1800 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      current = { background: canvas.toDataURL('image/webp', .88), position: 50, alt: '自选背景照片', credit: null };
      apply();
      if (persist()) status.textContent = '背景已更新，并保留在当前浏览器。';
    } catch { status.textContent = '这张照片无法读取，请换一张试试。'; }
    finally { URL.revokeObjectURL(localUrl); picker.value = ''; }
  });

  document.getElementById('reset-background').addEventListener('click', () => {
    current = { ...defaultConfig };
    apply();
    try { localStorage.removeItem(storageKey); } catch { /* No saved preference. */ }
    status.textContent = '已恢复当前公开主页的默认背景。';
  });

  document.getElementById('export-settings').addEventListener('click', () => {
    const source = `// kisaku05 background settings\nwindow.SITE_CONFIG = ${JSON.stringify(current, null, 2)};\n`;
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'site-config.js';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = '设置已下载。替换 GitHub 中的同名文件，即可更新公开背景。';
  });
})();
