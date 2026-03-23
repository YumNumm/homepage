import { useEffect, useState } from "react";
import { themeStore } from "$lib/stores/theme";

export function ThemeToggle() {
	const [theme, setTheme] = useState(themeStore.theme);

	useEffect(() => {
		themeStore.init();
		setTheme(themeStore.theme);
		return themeStore.subscribe(setTheme);
	}, []);

	function toggleTheme() {
		themeStore.toggle();
		setTheme(themeStore.theme);
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={
				theme === "light" ? "Switch to dark mode" : "Switch to light mode"
			}
			style={{
				background: "var(--color-surface)",
				border: "1px solid var(--color-border)",
				borderRadius: "8px",
				padding: "8px 16px",
				cursor: "pointer",
				color: "var(--color-text)",
				fontFamily: "inherit",
				transition: "all 0.2s ease",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.background = "var(--color-surface-hover)";
				e.currentTarget.style.borderColor = "var(--color-accent)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = "var(--color-surface)";
				e.currentTarget.style.borderColor = "var(--color-border)";
			}}
		>
			{theme === "light" ? "🌙" : "☀️"}
		</button>
	);
}
