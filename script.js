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
  const translations = {
    "en": {
      "name": "JI CE",
      "title": "JI CE — Personal homepage",
      "description": "JI CE · Sun Yat-sen University · Department of Mathematics · Information and Computing Science.",
      "skip": "Skip to content",
      "homepage": "Personal homepage",
      "photoRegion": "Waves and rocks off Newport, Australia",
      "photoAlt": "Aerial view of turquoise waves breaking around a rocky island off Newport, Australia",
      "photoLocation": "Newport, Australia",
      "language": "Language",
      "navigation": "Main navigation",
      "about": "About",
      "education": "Education",
      "avatar": "JI CE’s GitHub avatar",
      "undergraduate": "Undergraduate",
      "university": "Sun Yat-sen University",
      "field": "Department of Mathematics · Information and Computing Science",
      "contact": "Email addresses",
      "email": "Email",
      "academicBackground": "Academic background"
    },
    "zh-Hans": {
      "name": "纪策",
      "title": "纪策 — 个人主页",
      "description": "纪策 · 中山大学 · 数学系 · 信息与计算科学",
      "skip": "跳转到正文",
      "homepage": "个人主页",
      "photoRegion": "澳大利亚纽波特海岸的海浪与礁石",
      "photoAlt": "俯瞰澳大利亚纽波特海岸，碧蓝海浪拍打礁石小岛",
      "photoLocation": "澳大利亚 · 纽波特",
      "language": "选择语言",
      "navigation": "主导航",
      "about": "关于我",
      "education": "教育背景",
      "avatar": "纪策的头像",
      "undergraduate": "本科生",
      "university": "中山大学",
      "field": "数学系 · 信息与计算科学",
      "contact": "联系邮箱",
      "email": "邮箱",
      "academicBackground": "教育经历"
    },
    "zh-Hant": {
      "name": "紀策",
      "title": "紀策 — 個人主頁",
      "description": "紀策 · 中山大學 · 數學系 · 信息與計算科學",
      "skip": "跳至正文",
      "homepage": "個人主頁",
      "photoRegion": "澳洲紐波特海岸的海浪與礁石",
      "photoAlt": "俯瞰澳洲紐波特海岸，碧藍海浪拍打礁石小島",
      "photoLocation": "澳洲 · 紐波特",
      "language": "選擇語言",
      "navigation": "主導覽",
      "about": "關於我",
      "education": "教育背景",
      "avatar": "紀策的頭像",
      "undergraduate": "本科生",
      "university": "中山大學",
      "field": "數學系 · 信息與計算科學",
      "contact": "聯絡電郵",
      "email": "電郵",
      "academicBackground": "教育經歷"
    },
    "ja": {
      "name": "紀策",
      "title": "紀策 — ホームページ",
      "description": "紀策 · 中山大学 · 数学科 · 情報・計算科学",
      "skip": "本文へ移動",
      "homepage": "ホームページ",
      "photoRegion": "オーストラリア・ニューポートの波と岩礁",
      "photoAlt": "オーストラリアのニューポート沖にある岩礁の島に、青緑色の波が打ち寄せる空撮写真",
      "photoLocation": "オーストラリア · ニューポート",
      "language": "言語を選択",
      "navigation": "メインナビゲーション",
      "about": "プロフィール",
      "education": "学歴",
      "avatar": "紀策のプロフィール写真",
      "undergraduate": "学部生",
      "university": "中山大学",
      "field": "数学科 · 情報・計算科学",
      "contact": "連絡先メールアドレス",
      "email": "メール",
      "academicBackground": "学歴を見る"
    }
  };
  const languageKey = 'kisaku05-language';
  const languageButtons = document.querySelectorAll('[data-language]');
  const languageSwitcher = document.querySelector('.language-switcher');

  function setLanguage(language, remember = false) {
    const copy = translations[language];
    if (!copy) return;
    document.documentElement.lang = language;
    document.title = copy.title;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = copy[element.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      element.setAttribute('aria-label', copy[element.dataset.i18nAria]);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      element.alt = copy[element.dataset.i18nAlt];
    });
    document.querySelector('meta[name="description"]').content = copy.description;
    document.querySelector('meta[property="og:title"]').content = copy.title;
    document.querySelector('meta[property="og:description"]').content = copy.description;
    // Localize the current photo while preserving owner-defined replacement credits.
    if (!config.credit || config.credit.subject === 'Newport, Australia') {
      document.getElementById('photo-location').textContent = copy.photoLocation;
      photo.alt = copy.photoAlt;
    }
    languageButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    if (remember) {
      try { localStorage.setItem(languageKey, language); } catch (_) { /* Storage may be disabled. */ }
    }
  }

  let initialLanguage = 'en';
  try {
    const savedLanguage = localStorage.getItem(languageKey);
    if (Object.prototype.hasOwnProperty.call(translations, savedLanguage)) initialLanguage = savedLanguage;
  } catch (_) { /* Keep the default language when storage is unavailable. */ }
  languageButtons.forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.language, true));
  });
  setLanguage(initialLanguage);
  languageSwitcher.hidden = false;

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
