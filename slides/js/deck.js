/* Minimal keyboard-driven deck controller */

const SECTION_FILES = [
  "sections/00-cold-open.html",
  "sections/01-what-is-claude-code.html",
  "sections/02-commands.html",
  "sections/03-skills.html",
  "sections/04-claude-md.html",
  "sections/05-context-hygiene.html",
  "sections/07-responsible-use.html",
  "sections/10-wrap.html",
];

const state = {
  slides: [],
  current: 0,
  overview: false,
  notesVisible: false,
};

async function loadSections() {
  const deck = document.getElementById("deck");
  for (const file of SECTION_FILES) {
    try {
      const resp = await fetch(file);
      if (!resp.ok) throw new Error(`failed ${file}: ${resp.status}`);
      const html = await resp.text();
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      // Lift any <style> tags out of the section file and into <head>.
      // Section files are rendered as loose HTML fragments, so scoped
      // styles authored at the top of a section file would otherwise be
      // thrown away when we only append the <section.slide> elements.
      tmp.querySelectorAll("style").forEach((styleEl) => {
        document.head.appendChild(styleEl);
      });
      const sections = tmp.querySelectorAll("section.slide");
      sections.forEach((s) => deck.appendChild(s));
    } catch (err) {
      console.error(err);
      const err_slide = document.createElement("section");
      err_slide.className = "slide";
      err_slide.innerHTML = `<h2>Failed to load</h2><p>${file}</p><p class="caption">If you're opening index.html directly, run <code>python -m http.server</code> from the slides/ folder.</p>`;
      deck.appendChild(err_slide);
    }
  }
  state.slides = Array.from(document.querySelectorAll(".slide"));
  state.slides.forEach((s, i) => {
    s.dataset.index = i;
    const footer = document.createElement("div");
    footer.className = "slide-footer";
    const section = s.dataset.section || "";
    footer.innerHTML = `<span>${section}</span><span>${i + 1} / ${state.slides.length}</span>`;
    s.appendChild(footer);
    s.addEventListener("click", () => {
      if (state.overview) goTo(i);
    });
  });
  populateCtxGrids();
  goTo(0);
}

// Populate .ctx-real__grid elements from their data-fill attribute.
// Format: "category:count,category:count,..." — total should equal data-cells.
// Mirror of the helper in kit.html; lives here so slides can declare grids
// with data-fill and have the cells auto-generated at load time.
function populateCtxGrids() {
  document.querySelectorAll('.ctx-real__grid').forEach(grid => {
    if (grid.children.length > 0) return; // already populated
    const total = parseInt(grid.dataset.cells || '200', 10);
    const spec = grid.dataset.fill || '';
    if (!spec) return;
    const segments = spec.split(',').map(s => {
      const [cat, count] = s.split(':');
      return { cat: cat.trim(), count: parseInt(count, 10) };
    });
    const root = grid.closest('.ctx-real');
    const isCompact = root && root.classList.contains('ctx-compact-real');
    const summaryCount = parseInt(grid.dataset.summaryCount || '12', 10);

    const frag = document.createDocumentFragment();
    let placed = 0;
    for (const seg of segments) {
      for (let i = 0; i < seg.count && placed < total; i++, placed++) {
        const c = document.createElement('div');
        c.className = 'cell ' + seg.cat;
        c.style.setProperty('--i', placed);
        c.style.setProperty('--mi', i);
        if (isCompact && seg.cat === 'messages' && i < summaryCount) {
          c.classList.add('is-summary');
        }
        frag.appendChild(c);
      }
    }
    while (placed < total) {
      const c = document.createElement('div');
      c.className = 'cell free';
      c.style.setProperty('--i', placed);
      frag.appendChild(c);
      placed++;
    }
    grid.appendChild(frag);
  });
}

function goTo(i) {
  if (i < 0) i = 0;
  if (i >= state.slides.length) i = state.slides.length - 1;
  state.slides.forEach((s) => s.classList.remove("active"));
  state.slides[i].classList.add("active");
  state.current = i;
  updateProgress();
  updateNotes();
  if (state.overview) exitOverview();
  state.slides[i].scrollIntoView({ block: "nearest" });
}

function next() { goTo(state.current + 1); }
function prev() { goTo(state.current - 1); }

function updateProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  const pct = ((state.current + 1) / state.slides.length) * 100;
  bar.style.width = `${pct}%`;
}

function toggleOverview() {
  const deck = document.getElementById("deck");
  state.overview = !state.overview;
  deck.classList.toggle("overview", state.overview);
  if (state.overview) {
    state.slides.forEach((s) => s.classList.add("active"));
  } else {
    exitOverview();
  }
}
function exitOverview() {
  const deck = document.getElementById("deck");
  state.overview = false;
  deck.classList.remove("overview");
  state.slides.forEach((s, i) => {
    s.classList.toggle("active", i === state.current);
  });
}

function toggleNotes() {
  state.notesVisible = !state.notesVisible;
  const panel = document.getElementById("notes-panel");
  panel.classList.toggle("visible", state.notesVisible);
  updateNotes();
}
function updateNotes() {
  const panel = document.getElementById("notes-panel");
  if (!panel || !state.notesVisible) return;
  const slide = state.slides[state.current];
  const notes = slide ? slide.querySelector("aside.notes") : null;
  panel.innerHTML = notes
    ? `<h4>Speaker notes — slide ${state.current + 1}</h4>${notes.innerHTML}`
    : `<h4>Speaker notes — slide ${state.current + 1}</h4><p class="caption">(none)</p>`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next(); }
  else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
  else if (e.key === "Home") { goTo(0); }
  else if (e.key === "End") { goTo(state.slides.length - 1); }
  else if (e.key === "Escape") { toggleOverview(); }
  else if (e.key === "s" || e.key === "S") { toggleNotes(); }
  else if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
});

window.addEventListener("DOMContentLoaded", loadSections);
