/* Minimal keyboard-driven deck controller */

const SECTION_FILES = [
  "sections/00-cold-open.html",
  "sections/01-what-is-claude-code.html",
  "sections/02-commands.html",
  "sections/03-skills.html",
  "sections/04-claude-md.html",
  "sections/05-context-hygiene.html",
  "sections/06-subagents-hooks.html",
  "sections/07-responsible-use.html",
  "sections/08-scenario-b.html",
  "sections/09-scenario-d.html",
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
  goTo(0);
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
