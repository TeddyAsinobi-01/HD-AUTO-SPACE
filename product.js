/* ==========================================================================
   HD AUTO SPACE - shop page
   Reads CATEGORIES and PRODUCTS from products.js and gives visitors:
   category filters, search, "show more", a larger photo viewer, and a
   WhatsApp button on every part. Filters are saved in the address bar, so a
   link like product.html?cat=filters&q=mack can be shared.
   Replaces the old product.js (the hard-coded slide buttons) and the
   old liveSearch().
   ========================================================================== */

(() => {
    'use strict';

    const { waLink } = window.HD;
    const PAGE_SIZE = 24;

    const $ = (selector) => document.querySelector(selector);
    const el = {
        form: $('#search-form'),
        input: $('#q'),
        clear: $('#search-clear'),
        catList: $('#cat-list'),
        title: $('#results-title'),
        count: $('#results-count'),
        reset: $('#reset'),
        grid: $('#grid'),
        empty: $('#empty'),
        emptyTitle: $('#empty-title'),
        emptyWa: $('#empty-wa'),
        emptyReset: $('#empty-reset'),
        more: $('#more'),
        moreBtn: $('#more-btn'),
        moreNote: $('#more-note'),
        viewer: $('#viewer'),
        viewerMedia: $('#viewer-media'),
        viewerImg: $('#viewer-img'),
        viewerCat: $('#viewer-cat'),
        viewerName: $('#viewer-name'),
        viewerTag: $('#viewer-tag'),
        viewerWa: $('#viewer-wa'),
        viewerPrev: $('#viewer-prev'),
        viewerNext: $('#viewer-next'),
        viewerClose: $('#viewer-close'),
    };

    /* ---------------------------------------------------------------- data */

    const catName = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

    // lower-case, no accents, punctuation turned into spaces
    const normalise = (s) =>
        String(s)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();

    const items = PRODUCTS.map((p, id) => {
        const category = catName[p.cat] || 'Other';
        return {
            id,
            cat: p.cat,
            name: p.name,
            img: p.img,
            category,
            // a badge is only shown for parts that are not marked "New"
            tag: p.tag && p.tag.toLowerCase() !== 'new' ? p.tag : '',
            words: normalise(p.name).split(' '),
            catWords: normalise(category).split(' '),
        };
    });

    /* -------------------------------------------------------------- search */

    // "air filter" -> both words must match.
    // "benz|actros" -> either group may match.
    function parseQuery(raw) {
        return raw
            .split('|')
            .map((group) =>
                normalise(group)
                    .split(' ')
                    .filter(Boolean)
                    .map((t) => (t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t))
            )
            .filter((tokens) => tokens.length);
    }

    // short words (jac, man, daf) must match a whole word, so "man" does not match "manifold"
    function tokenMatches(words, token) {
        return token.length <= 3
            ? words.some((w) => w === token || w === `${token}s`)
            : words.some((w) => w.startsWith(token));
    }

    const state = { cat: 'all', q: '', groups: [], shown: PAGE_SIZE, results: [] };

    // a part matches when every word is in its name, or every word is in its category name
    // (so "batteries" finds the battery photos even if they have no name)
    const matchesQuery = (item) =>
        !state.groups.length ||
        state.groups.some(
            (tokens) =>
                tokens.every((t) => tokenMatches(item.words, t)) ||
                tokens.every((t) => tokenMatches(item.catWords, t))
        );

    /* ------------------------------------------------------------- helpers */

    const esc = (s) =>
        String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const plural = (n) => `${n} ${n === 1 ? 'part' : 'parts'}`;
    const firstTerm = (q) => q.split('|')[0].trim();
    // "benz|actros" reads better as "benz, actros" in headings
    const prettyQuery = (q) => q.split('|').map((s) => s.trim()).filter(Boolean).join(', ');

    const iconChat = '<svg class="i" aria-hidden="true"><use href="#i-chat"/></svg>';

    const askMessage = (name) =>
        `Hello, I'm interested in the ${name}. Please send me the price and availability.`;

    /* ---------------------------------------------------------- categories */

    function buildCategoryButtons() {
        const defs = [{ id: 'all', name: 'All parts' }, ...CATEGORIES];
        el.catList.innerHTML = defs
            .map(
                (c) => `<button class="cat-btn" type="button" data-cat="${esc(c.id)}" aria-pressed="false">
                    <span>${esc(c.name)}</span><span class="cat-count"></span></button>`
            )
            .join('');
    }

    function updateCategoryButtons() {
        // counts follow the current search, so people can see where matches are
        const counts = { all: 0 };
        items.forEach((item) => {
            if (!matchesQuery(item)) return;
            counts.all += 1;
            counts[item.cat] = (counts[item.cat] || 0) + 1;
        });
        el.catList.querySelectorAll('.cat-btn').forEach((btn) => {
            const id = btn.dataset.cat;
            const n = counts[id] || 0;
            btn.setAttribute('aria-pressed', String(id === state.cat));
            btn.classList.toggle('is-empty', n === 0);
            btn.querySelector('.cat-count').textContent = n;
        });
    }

    /* ------------------------------------------------------------- results */

    function cardHtml(p) {
        const tag = p.tag ? `<p class="card-tag">${esc(p.tag)}</p>` : '';
        return `<li class="card">
            <button class="card-media plate" type="button" data-view="${p.id}" aria-label="View larger photo of ${esc(p.name)}">
                <img src="${esc(p.img)}" alt="" width="400" height="400" loading="lazy" decoding="async">
            </button>
            <div class="card-body">
                <p class="card-cat">${esc(p.category)}</p>
                <h3 class="card-name">${esc(p.name)}</h3>
                ${tag}
                <a class="btn btn-wa" href="${esc(waLink(askMessage(p.name)))}" target="_blank" rel="noopener">${iconChat} Ask on WhatsApp</a>
            </div>
        </li>`;
    }

    function appendCards(from, to) {
        el.grid.insertAdjacentHTML('beforeend', state.results.slice(from, to).map(cardHtml).join(''));
    }

    function renderResults() {
        state.results = items.filter((p) => (state.cat === 'all' || p.cat === state.cat) && matchesQuery(p));
        const total = state.results.length;
        const filtered = state.cat !== 'all' || state.q !== '';

        // heading + count
        el.title.textContent = state.q
            ? `Results for \u201C${prettyQuery(state.q)}\u201D`
            : state.cat === 'all' ? 'All parts' : catName[state.cat];
        el.count.textContent =
            state.q && state.cat !== 'all'
                ? `${plural(total)} in ${catName[state.cat]}`
                : plural(total);
        el.reset.hidden = !filtered;
        el.clear.classList.toggle('is-visible', el.input.value !== '');

        // grid
        el.grid.innerHTML = '';
        el.grid.hidden = total === 0;
        el.empty.hidden = total !== 0;
        if (total === 0) {
            const what = state.q ? firstTerm(state.q) : catName[state.cat];
            el.emptyTitle.textContent = state.q
                ? `No parts found for \u201C${prettyQuery(state.q)}\u201D`
                : `No parts listed in ${catName[state.cat]} yet`;
            el.emptyWa.href = waLink(`Hello, do you have ${what} in stock?`);
        }
        appendCards(0, state.shown);
        updateMore();

        updateCategoryButtons();
        document.title =
            state.cat === 'all'
                ? 'Truck Parts Catalogue | HD Auto Space'
                : `${catName[state.cat]} | Truck Parts Catalogue | HD Auto Space`;
        syncUrl();
    }

    function updateMore() {
        const total = state.results.length;
        const shown = Math.min(state.shown, total);
        el.more.hidden = total <= PAGE_SIZE;
        el.moreBtn.hidden = shown >= total;
        el.moreNote.textContent = shown >= total ? `Showing all ${total} parts` : `Showing ${shown} of ${total}`;
    }

    /* ----------------------------------------------------------------- URL */

    function syncUrl() {
        const params = new URLSearchParams();
        if (state.cat !== 'all') params.set('cat', state.cat);
        if (state.q) params.set('q', state.q);
        const qs = params.toString().replace(/%7C/g, '|').replace(/\+/g, '%20');
        history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : ''));
    }

    function readUrl() {
        const params = new URLSearchParams(location.search);
        const cat = params.get('cat');
        state.cat = cat && catName[cat] ? cat : 'all';
        state.q = (params.get('q') || '').trim();
        state.groups = parseQuery(state.q);
        el.input.value = state.q.split('|').map((s) => s.trim()).join(' | ');
    }

    /* ------------------------------------------------------------- actions */

    // after a filter change, bring the top of the list back into view if the page was scrolled past it
    function scrollToResults() {
        const header = document.querySelector('.site-header');
        const nav = document.querySelector('.shop-nav');
        const narrow = !window.matchMedia('(min-width: 960px)').matches;
        const offset = header.offsetHeight + (narrow ? nav.offsetHeight : 0) + 12;
        const top = el.title.getBoundingClientRect().top;
        if (top < offset) {
            window.scrollTo({ top: window.scrollY + top - offset, behavior: 'auto' });
        }
    }

    function setFilters({ cat = state.cat, q = state.q } = {}, { scroll = false } = {}) {
        state.cat = cat;
        state.q = q.trim();
        state.groups = parseQuery(state.q);
        state.shown = PAGE_SIZE;
        renderResults();
        if (scroll) scrollToResults();
    }

    let searchTimer;
    el.input.addEventListener('input', () => {
        el.clear.classList.toggle('is-visible', el.input.value !== '');
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => setFilters({ q: el.input.value }), 150);
    });

    el.form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearTimeout(searchTimer);
        setFilters({ q: el.input.value });
        el.input.blur(); // closes the phone keyboard
    });

    el.clear.addEventListener('click', () => {
        el.input.value = '';
        setFilters({ q: '' });
        el.input.focus();
    });

    el.catList.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cat]');
        if (btn) setFilters({ cat: btn.dataset.cat }, { scroll: true });
    });

    const resetAll = () => {
        el.input.value = '';
        setFilters({ cat: 'all', q: '' }, { scroll: true });
    };
    el.reset.addEventListener('click', resetAll);
    el.emptyReset.addEventListener('click', resetAll);

    el.moreBtn.addEventListener('click', () => {
        const from = state.shown;
        state.shown += PAGE_SIZE;
        appendCards(from, state.shown);
        updateMore();
        // keep keyboard users on the list: move focus to the first new card's button
        const firstNew = el.grid.children[from];
        if (firstNew) firstNew.querySelector('.card-media').focus({ preventScroll: true });
    });

    /* -------------------------------------------------------------- viewer */

    let viewIndex = 0;

    function showViewer(i) {
        const list = state.results;
        if (!list.length) return;
        viewIndex = (i + list.length) % list.length;
        const p = list[viewIndex];

        el.viewerMedia.classList.remove('is-missing');
        el.viewerImg.src = p.img;
        el.viewerImg.alt = p.name;
        el.viewerCat.textContent = p.category;
        el.viewerName.textContent = p.name;
        el.viewerTag.textContent = p.tag;
        el.viewerTag.hidden = !p.tag;
        el.viewerWa.href = waLink(askMessage(p.name));

        const single = list.length < 2;
        el.viewerPrev.hidden = single;
        el.viewerNext.hidden = single;
    }

    function openViewer(id) {
        const i = state.results.findIndex((p) => p.id === id);
        if (i === -1) return;
        showViewer(i);
        if (!el.viewer.open) {
            el.viewer.showModal();
            document.documentElement.style.overflow = 'hidden';
        }
    }

    el.grid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-view]');
        if (btn) openViewer(Number(btn.dataset.view));
    });

    el.viewerPrev.addEventListener('click', () => showViewer(viewIndex - 1));
    el.viewerNext.addEventListener('click', () => showViewer(viewIndex + 1));
    el.viewerClose.addEventListener('click', () => el.viewer.close());
    el.viewer.addEventListener('click', (e) => {
        if (e.target === el.viewer) el.viewer.close(); // click on the dark backdrop
    });
    el.viewer.addEventListener('close', () => {
        document.documentElement.style.overflow = '';
    });
    el.viewer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showViewer(viewIndex - 1);
        if (e.key === 'ArrowRight') showViewer(viewIndex + 1);
    });

    /* ---------------------------------------------------------------- init */

    buildCategoryButtons();
    readUrl();
    renderResults();
})();
