/* ==========================================================================
   HD AUTO SPACE - shared behaviour (loaded on every page)
   Plain JavaScript, no libraries. Replaces the old app.js and mobile.js.
   ========================================================================== */

(() => {
    'use strict';

    /* ----------------------------------------------------------------------
       SITE DETAILS - change the business number, hours or email here.
       Every WhatsApp and phone link on the site is built from these values.
       ---------------------------------------------------------------------- */
    const SITE = {
        whatsapp: '2348066202457',   // international format: no +, spaces or leading 0
        phoneTel: '+2348066202457',
        phoneText: '0806-620-2457',
        hours: { open: '07:00', close: '17:30', timeZone: 'Africa/Lagos' },
    };

    const waLink = (text) =>
        `https://wa.me/${SITE.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');

    // product.js reads these
    window.HD = { SITE, waLink };

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ----------------------------------------------------------------------
       Contact links: <a data-wa="message"> and <a data-tel> use SITE above
       ---------------------------------------------------------------------- */
    function wireContactLinks(root = document) {
        $$('[data-wa]', root).forEach((a) => {
            a.href = waLink(a.dataset.wa);
        });
        $$('[data-tel]', root).forEach((a) => {
            a.href = `tel:${SITE.phoneTel}`;
        });
        $$('[data-phone-text]', root).forEach((el) => {
            el.textContent = SITE.phoneText;
        });
    }

    /* ----------------------------------------------------------------------
       Mobile menu
       ---------------------------------------------------------------------- */
    function initMenu() {
        const toggle = $('.menu-toggle');
        const drawer = $('#drawer');
        if (!toggle || !drawer) return;

        const setOpen = (open) => {
            drawer.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
        };

        toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
        drawer.addEventListener('click', (e) => {
            if (e.target.closest('a')) setOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                setOpen(false);
                toggle.focus();
            }
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.site-header')) setOpen(false);
        });
        window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
            if (e.matches) setOpen(false);
        });
    }

    /* ----------------------------------------------------------------------
       Hero slider: fade between slides, dots, swipe, pause button.
       Autoplay stops on hover/focus, when the tab is hidden, and for people
       who ask their device to reduce motion.
       ---------------------------------------------------------------------- */
    function initSlider(root) {
        const slides = $$('.spot-slide', root);
        const dotsWrap = $('.spot-dots', root);
        const toggleBtn = $('[data-slider-toggle]', root);
        if (slides.length < 2) return;

        const INTERVAL = 5000;
        let index = 0;
        let timer = null;
        let userPaused = reducedMotion.matches;
        let hovering = false;

        const dots = slides.map((_, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'spot-dot';
            b.setAttribute('aria-label', `Show slide ${i + 1}`);
            b.addEventListener('click', () => go(i, true));
            dotsWrap.append(b);
            return b;
        });

        function go(i, fromUser = false) {
            index = (i + slides.length) % slides.length;
            slides.forEach((s, n) => {
                const active = n === index;
                s.classList.toggle('is-active', active);
                s.toggleAttribute('inert', !active);
                s.setAttribute('aria-hidden', String(!active));
            });
            dots.forEach((d, n) => d.setAttribute('aria-current', String(n === index)));
            if (fromUser) restart();
        }

        function stop() {
            clearInterval(timer);
            timer = null;
        }

        function start() {
            stop();
            if (userPaused || hovering || document.hidden) return;
            timer = setInterval(() => go(index + 1), INTERVAL);
        }

        const restart = start;

        function setUserPaused(paused) {
            userPaused = paused;
            toggleBtn.setAttribute('aria-pressed', String(paused));
            toggleBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
            start();
        }

        toggleBtn.addEventListener('click', () => setUserPaused(!userPaused));
        root.addEventListener('mouseenter', () => { hovering = true; stop(); });
        root.addEventListener('mouseleave', () => { hovering = false; start(); });
        root.addEventListener('focusin', () => { hovering = true; stop(); });
        root.addEventListener('focusout', () => { hovering = false; start(); });
        document.addEventListener('visibilitychange', start);

        // swipe
        let startX = null;
        root.addEventListener('pointerdown', (e) => {
            if (e.target.closest('a, button')) return;
            startX = e.clientX;
        });
        root.addEventListener('pointerup', (e) => {
            if (startX === null) return;
            const dx = e.clientX - startX;
            startX = null;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1), true);
        });
        root.addEventListener('pointercancel', () => { startX = null; });

        root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') go(index + 1, true);
            if (e.key === 'ArrowLeft') go(index - 1, true);
        });

        setUserPaused(userPaused);
        go(0);
    }

    /* ----------------------------------------------------------------------
       Horizontal card rails (Top hot deals): previous / next buttons
       ---------------------------------------------------------------------- */
    function initRails() {
        $$('.rail').forEach((rail) => {
            const prev = $(`[data-rail-prev="${rail.id}"]`);
            const next = $(`[data-rail-next="${rail.id}"]`);
            if (!prev || !next) return;

            const step = () => rail.clientWidth * 0.9;
            const update = () => {
                const max = rail.scrollWidth - rail.clientWidth - 2;
                prev.disabled = rail.scrollLeft <= 2;
                next.disabled = rail.scrollLeft >= max;
            };

            prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
            next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));

            let ticking = false;
            rail.addEventListener('scroll', () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => { update(); ticking = false; });
            }, { passive: true });
            window.addEventListener('resize', update);
            update();
        });
    }

    /* ----------------------------------------------------------------------
       "Search a part" on the home page: skip the empty search
       ---------------------------------------------------------------------- */
    function initFinder() {
        const form = $('.finder');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            const q = form.elements.q.value.trim();
            if (!q) {
                e.preventDefault();
                window.location.href = 'product.html';
            } else {
                form.elements.q.value = q;
            }
        });
    }

    /* ----------------------------------------------------------------------
       Contact form: builds a WhatsApp message and opens it
       ---------------------------------------------------------------------- */
    function initEnquiry() {
        const form = $('#enquiry');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const part = form.elements.part.value.trim();
            const make = form.elements.make.value;
            const notes = form.elements.notes.value.trim();
            if (!part) {
                form.elements.part.focus();
                return;
            }

            let text = `Hello HD Auto Space, I need ${part}`;
            if (make && make !== 'Other') text += ` for a ${make}`;
            text += '.';
            if (notes) text += ` Details: ${notes}.`;
            text += ' Please send me the price and availability.';

            const url = waLink(text);
            const win = window.open(url, '_blank', 'noopener');
            if (!win) window.location.href = url;
        });
    }

    /* ----------------------------------------------------------------------
       Opening hours: "Open now" / "Closed now", using Nigerian time
       ---------------------------------------------------------------------- */
    function initOpenStatus() {
        const el = $('[data-open-status]');
        if (!el) return;

        const toMinutes = (hhmm) => {
            const [h, m] = hhmm.split(':').map(Number);
            return h * 60 + m;
        };
        const label = (hhmm) => {
            const [h, m] = hhmm.split(':').map(Number);
            const suffix = h >= 12 ? 'pm' : 'am';
            return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
        };

        function update() {
            let nowMin;
            try {
                const parts = new Intl.DateTimeFormat('en-GB', {
                    timeZone: SITE.hours.timeZone,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }).formatToParts(new Date());
                const h = Number(parts.find((p) => p.type === 'hour').value) % 24;
                const m = Number(parts.find((p) => p.type === 'minute').value);
                nowMin = h * 60 + m;
            } catch {
                return; // unsupported browser: leave the status blank
            }
            const open = nowMin >= toMinutes(SITE.hours.open) && nowMin < toMinutes(SITE.hours.close);
            el.classList.toggle('is-open', open);
            el.classList.toggle('is-closed', !open);
            el.textContent = open
                ? `Open now, closes ${label(SITE.hours.close)}`
                : `Closed now, opens ${label(SITE.hours.open)}`;
        }

        update();
        setInterval(update, 60000);
    }

    /* ----------------------------------------------------------------------
       Photos that are missing or fail to load get a neutral placeholder
       instead of a broken-image icon.
       ---------------------------------------------------------------------- */
    function initImageFallbacks() {
        const mark = (img) => {
            const box = img.closest('.plate, .spot-slide, .viewer-media');
            if (box) box.classList.add('is-missing');
        };
        // error events do not bubble, so listen in the capture phase
        document.addEventListener('error', (e) => {
            if (e.target instanceof HTMLImageElement) mark(e.target);
        }, true);
        // images that already failed before this script ran
        $$('img').forEach((img) => {
            if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) mark(img);
        });
    }

    /* ---------------------------------------------------------------------- */

    function init() {
        wireContactLinks();
        initMenu();
        const slider = $('[data-slider]');
        if (slider) initSlider(slider);
        initRails();
        initFinder();
        initEnquiry();
        initOpenStatus();
        initImageFallbacks();
        $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    }

    // expose so product.js can wire links it creates later
    window.HD.wireContactLinks = wireContactLinks;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
