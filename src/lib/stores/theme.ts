import { browser } from "$app/environment";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (!browser) return "light";

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

class ThemeStore {
  private _theme: Theme = getInitialTheme();
  private subscribers: Set<(theme: Theme) => void> = new Set();

  get theme(): Theme {
    return this._theme;
  }

  setTheme(theme: Theme) {
    this._theme = theme;
    if (browser) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.setAttribute("data-radix-theme", theme);
    }
    this.subscribers.forEach((subscriber) => subscriber(theme));
  }

  toggle() {
    this.setTheme(this._theme === "light" ? "dark" : "light");
  }

  init() {
    if (browser) {
      document.documentElement.setAttribute("data-theme", this._theme);
      document.documentElement.setAttribute("data-radix-theme", this._theme);
    }
  }

  subscribe(callback: (theme: Theme) => void) {
    this.subscribers.add(callback);
    callback(this._theme);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}

export const themeStore = new ThemeStore();
