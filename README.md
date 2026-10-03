# Saad Gym Fitness

A responsive gym landing page built with HTML, CSS and vanilla JavaScript. Light mint and evergreen design, self-hosted Manrope and Barlow Condensed fonts, and responsive WebP photography derived from the original repository assets.

[View the website](https://scriptingwithsaad.github.io/Saad-Gym-Fitness-Landing-Page/)

Training details use a native dialog with keyboard focus management. On mobile and tablets it fills the visual viewport, opens at the top, keeps the close button visible and restores the page's scroll position on closing. Navigation collapses into an accessible menu. FAQs work without JavaScript.

The enquiry form prepares an editable message locally. Visitors copy it and send it through the owner's Instagram or Facebook profile. It does not submit personal details to a server or claim a booking is confirmed. Without JavaScript, direct contact links remain available.

## Local development

Run `python -m http.server 8770` and open `http://127.0.0.1:8770/`.

After editing CSS or JavaScript, run `python scripts/build_assets.py`. The HTML references generated assets with content hashes to avoid stale browser caches. Run `python scripts/verify_assets.py` and `node --check script/app.js` before publishing.

To rebuild the image variants, install Pillow in your Python environment and run `python scripts/optimize_images.py`. Original images remain in `assets/images`. Font licenses are in `assets/fonts`. Design intent is documented in `DESIGN.md`.

Responsive checks cover 320, 360, 390, 430, 667, 820, 844, 1024 and 1440 pixel widths, including landscape. Checks include overflow, images, mobile dialog bounds, scroll reset/restoration, menu, focus/keyboard behavior, FAQ expansion and the editable enquiry flow.
