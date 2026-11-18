/* AVC app extras — optional. The app works without this file (screens are pure CSS).
   Adds: dark-mode toggle, countdown chip, directory search, scroll-to-top on screen change.
   No network calls, no backend. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // EDIT ME: label + date for the countdown chip on Home
  const COUNTDOWN = { label: "next key date", date: "2027-01-18" };

  const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } },
                  set(k,v){ try { localStorage.setItem(k,v); } catch {} } };

  // dark mode
  const root = document.documentElement;
  const saved = store.get("avc-theme"); if (saved) root.dataset.theme = saved;
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

  // countdown chip
  const hero = $(".hero");
  if (hero) {
    const d = Math.ceil((new Date(COUNTDOWN.date + "T00:00") - new Date()) / 864e5);
    if (d > 0) { const s = document.createElement("span"); s.className = "avc-chip";
      s.textContent = `${d} day${d === 1 ? "" : "s"} until ${COUNTDOWN.label}`; hero.append(s); }
  }

  // directory search
  const dir = $("#directory .screen-body") || $("#directory");
  const rows = $$("#directory .list-row");
  if (dir && rows.length) {
    const i = document.createElement("input"); i.type = "search"; i.className = "avc-search";
    i.placeholder = "Search staff"; i.setAttribute("aria-label", "Search staff");
    dir.prepend(i);
    i.addEventListener("input", () => { const q = i.value.trim().toLowerCase();
      rows.forEach(r => r.hidden = q && !r.textContent.toLowerCase().includes(q)); });
  }

  // settings: dark mode row on More
  const more = $("#more .screen-body") || $("#more");
  if (more) {
    const b = document.createElement("button"); b.className = "list-row card"; b.type = "button";
    b.style.cssText = "width:100%;margin-top:14px;text-align:left;font:inherit;color:inherit";
    const paint = () => b.innerHTML = `<span class="row-text"><strong>Dark mode</strong><span>${isDark() ? "On" : "Off"} · saved on this device</span></span>`;
    b.addEventListener("click", () => { const t = isDark() ? "light" : "dark"; root.dataset.theme = t; store.set("avc-theme", t); paint(); });
    paint(); more.prepend(b);
    const n = document.createElement("p"); n.className = "avc-note";
    n.textContent = "Unofficial student app. Classes, events, news and staff are sample content. Check avc.edu for official information.";
    more.append(n);
  }

  // scroll to top when switching screens
  $$(".state-radio").forEach(r => r.addEventListener("change", () => $$(".screen").forEach(s => s.scrollTop = 0)));
})();
