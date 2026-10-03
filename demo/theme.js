// Demo only: applies and persists the theme. Load in <head>, before first paint.
(() => {
  const KEY = "se-theme";
  const THEMES = ["light", "dark", "auto", "navy", "plum", "teal", "olive", "volt", "ultramarine", "gruvbox"];

  const read = () => {
    const fromUrl = new URLSearchParams(location.search).get("theme");
    if (THEMES.includes(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem(KEY);
      if (THEMES.includes(saved)) return saved;
    } catch {}
    return "light";
  };

  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {}
  };

  apply(read());

  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("theme");
    if (select) {
      select.value = document.documentElement.dataset.theme;
      select.addEventListener("change", () => apply(select.value));
    }

    const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
    const markCurrent = () => {
      navLinks.forEach((a) => a.removeAttribute("aria-current"));
      navLinks.find((a) => a.hash === location.hash)?.setAttribute("aria-current", "location");
    };
    markCurrent();
    window.addEventListener("hashchange", markCurrent);

    document.querySelectorAll("[data-open-dialog]").forEach((button) =>
      button.addEventListener("click", () => document.getElementById(button.dataset.openDialog)?.showModal()),
    );

    document.querySelectorAll(".palette > li").forEach((swatch) => {
      const hex = swatch.querySelector("code")?.textContent.trim();
      if (!hex) return;
      swatch.setAttribute("role", "button");
      swatch.tabIndex = 0;
      swatch.title = `Copy ${hex}`;
      swatch.setAttribute("aria-label", `Copy ${hex}`);

      let timer;
      const copy = async () => {
        try {
          await navigator.clipboard.writeText(hex);
        } catch {
          const area = Object.assign(document.createElement("textarea"), { value: hex });
          document.body.append(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        swatch.dataset.copied = "";
        clearTimeout(timer);
        timer = setTimeout(() => delete swatch.dataset.copied, 1200);
      };

      swatch.addEventListener("click", copy);
      swatch.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          copy();
        }
      });
    });
  });
})();
