# kisaku05

Personal academic homepage for 纪策.

**Website:** https://kinosaku.github.io/kisaku05/

Sun Yat-sen University · Department of Mathematics · Information and Computing Science.

## Owner updates

The public website is read-only. It has no upload form, editor, visitor settings, database, or write endpoint. Changes to the published website require authenticated write access to this GitHub repository. Public visibility does not give visitors write access.

The homepage supports English (default), Simplified Chinese, Traditional Chinese, and Japanese. Visitors can switch languages beside the navigation; their choice is remembered locally on their own device. This preference does not edit the published site.

Sign in as the repository owner to edit all four language copies in the `translations` object in `script.js`, the English fallback in `index.html`, or `style.css` (layout). To change the background, upload a photo to `assets/` and edit its path and credit in `site-config.js`. Commit to `main`; GitHub Pages publishes the update automatically. Replace `assets/avatar.png` to change the avatar.

Keep repository access limited to the owner and explicitly authorized integrations. Do not add collaborators with write access if the site must remain owner-managed.

## Assets

- Background: Newport, Australia, photographed by **James Donaldson**, [Unsplash](https://unsplash.com/photos/top-view-of-rocky-small-island-PVKmIt8tTvs), used under the [Unsplash License](https://unsplash.com/license). Responsive image sources up to 3992 × 2242 pixels are configured in `site-config.js`. An earlier local background is retained in `assets/`.
- Chinese type: **LXGW WenKai**, based on Fontworks' Klee One. The local `wenkai-i18n.woff` subset covers the Simplified Chinese, Traditional Chinese, and Japanese text displayed on this page. See `assets/wenkai-OFL.txt` for the SIL Open Font License. When adding Chinese text, extend the subset or use the full font.
- Avatar: the GitHub avatar of [@kinosaku](https://github.com/kinosaku).

Plain HTML, CSS and JavaScript; no build step or external font service. GitHub Pages serves `main` from `/ (root)`.
