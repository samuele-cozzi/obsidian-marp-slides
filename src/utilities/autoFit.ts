/**
 * Shrink the font size of slides whose content overflows them, so oversized
 * slides are scaled down instead of clipped.
 */
export function fitSections(sections: ArrayLike<HTMLElement>) {
    // Tables default to full size instead of the theme's inner scroll box
    // (display:block + overflow:auto inside a flex column), so the shrink
    // below can see the overflow and fit the whole slide.
    if (!document.getElementById('marp-table-fit')) {
        const st = document.createElement('style');
        st.id = 'marp-table-fit';
        st.textContent = 'section > * { flex-shrink: 0 !important; } section table { overflow: visible !important; }';
        document.head.appendChild(st);
    }

    const overflows = (s: HTMLElement) => s.scrollHeight > s.clientHeight || s.scrollWidth > Math.ceil(s.clientWidth);
    const list = Array.from(sections);

    list.forEach(s => {
        if (!s.dataset.originalFontSize) {
            s.dataset.originalFontSize = window.getComputedStyle(s).fontSize;
        }
        s.style.fontSize = s.dataset.originalFontSize;
    });

    // Binary-search each overflowing section's font size, all sections in
    // lockstep: write every size, then read every size, so each round costs
    // one layout instead of one per section.
    const todo = list.filter(overflows).map(s => ({ s, lo: 5, hi: parseFloat(s.dataset.originalFontSize ?? '') }));
    for (let k = 0; k < 7 && todo.length; k++) {
        todo.forEach(t => { t.s.style.fontSize = `${(t.lo + t.hi) / 2}px`; });
        todo.forEach(t => {
            const mid = (t.lo + t.hi) / 2;
            if (overflows(t.s)) t.hi = mid; else t.lo = mid;
        });
    }
    todo.forEach(t => { t.s.style.fontSize = `${t.lo}px`; });

    // Re-fit a section once its late-loading images arrive
    list.forEach(s => s.querySelectorAll('img').forEach(img => {
        if (!img.complete && !img.dataset.scaleBound) {
            img.dataset.scaleBound = 'true';
            img.addEventListener('load', () => fitSections([s]));
        }
    }));
}
