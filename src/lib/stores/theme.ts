import { browser } from "$app/environment";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
	if (!browser) return "light";

	// システム設定を優先
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const systemTheme = prefersDark ? "dark" : "light";

	// localStorageに保存された値がある場合はそれを使用（ユーザーが明示的に設定した場合）
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	return systemTheme;
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

			// 背景色を更新
			if (theme === "dark") {
				document.documentElement.style.backgroundColor = "#0B192C";
				document.documentElement.style.color = "#d0d1e7";
			} else {
				document.documentElement.style.backgroundColor = "#E4F2FF";
				document.documentElement.style.color = "#1a1a2e";
			}
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

			// 背景色を更新
			if (this._theme === "dark") {
				document.documentElement.style.backgroundColor = "#0B192C";
				document.documentElement.style.color = "#d0d1e7";
			} else {
				document.documentElement.style.backgroundColor = "#E4F2FF";
				document.documentElement.style.color = "#1a1a2e";
			}
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
