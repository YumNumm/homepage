import "@radix-ui/themes/styles.css";
import "../app.css";

import { useEffect, useState } from "react";
import { Theme } from "@radix-ui/themes";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from "@tanstack/react-router";
import { Snackbar } from "$lib/components/Snackbar";
import { ThemeToggle } from "$lib/components/ThemeToggle";
import { themeStore } from "$lib/stores/theme";

const THEME_INIT_SCRIPT = `(function(){try{var k="theme";var s=localStorage.getItem(k);var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);document.documentElement.setAttribute("data-radix-theme",t);var d=t==="dark";document.documentElement.style.backgroundColor=d?"#0B192C":"#E4F2FF";document.documentElement.style.color=d?"#d0d1e7":"#070019";document.body&&(document.body.style.backgroundColor="transparent");}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
		],
		links: [
			{ rel: "icon", type: "image/jpeg", href: "/favicon.jpg" },
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap",
			},
		],
	}),
	component: RootLayout,
});

function RootLayout() {
	const [theme, setTheme] = useState(themeStore.theme);
	const [snackbar, setSnackbar] = useState<{
		message: string;
		duration: number;
	} | null>(null);

	useEffect(() => {
		themeStore.init();
		return themeStore.subscribe(setTheme);
	}, []);

	useEffect(() => {
		const show = (message: string, duration = 1500) => {
			setSnackbar({ message, duration });
			setTimeout(() => setSnackbar(null), duration + 300);
		};

		const handleCopyClick = async (event: Event) => {
			const button = event.currentTarget as HTMLButtonElement;
			const codeId = button.getAttribute("data-code-id");
			if (!codeId) return;
			const codeElement = document.getElementById(codeId);
			if (!codeElement) return;
			const codeText =
				codeElement.querySelector("code")?.textContent ||
				codeElement.textContent ||
				"";
			try {
				await navigator.clipboard.writeText(codeText);
				const originalHTML = button.innerHTML;
				button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
				setTimeout(() => {
					button.innerHTML = originalHTML;
				}, 2000);
				show("コードをコピーしました");
			} catch (err) {
				console.error(err);
				show("コードのコピーに失敗しました");
			}
		};

		const copyButtons = document.querySelectorAll(".code-block-copy");
		copyButtons.forEach((button) => {
			button.addEventListener("click", handleCopyClick);
		});

		const copyObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as HTMLElement;
						if (element.matches(".code-block-copy")) {
							element.addEventListener("click", handleCopyClick);
						}
						element.querySelectorAll(".code-block-copy").forEach((b) => {
							b.addEventListener("click", handleCopyClick);
						});
					}
				}
			}
		});
		copyObserver.observe(document.body, { childList: true, subtree: true });

		const handleHeadingClick = async (event: Event) => {
			const target = event.currentTarget as HTMLElement;
			const id = target.id;
			if (!id) return;
			const url = new URL(window.location.href);
			url.hash = id;
			await navigator.clipboard.writeText(url.toString());
			target.scrollIntoView({ behavior: "smooth", block: "start" });
			window.history.replaceState(
				null,
				"",
				url.pathname + url.search + url.hash,
			);
			show("URLをコピーしました");
		};

		const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
		headings.forEach((heading) => {
			heading.addEventListener("click", handleHeadingClick);
		});

		const headingObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as HTMLElement;
						if (element.matches("h1, h2, h3, h4, h5, h6")) {
							element.addEventListener("click", handleHeadingClick);
						}
						element.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
							h.addEventListener("click", handleHeadingClick);
						});
					}
				}
			}
		});
		headingObserver.observe(document.body, { childList: true, subtree: true });

		const wrapTables = () => {
			const tables = document.querySelectorAll("table:not(.wrapped)");
			for (const table of tables) {
				if (table.classList.contains("wrapped")) continue;
				const parent = table.parentElement;
				if (!parent) continue;
				if (table.scrollWidth > parent.clientWidth) {
					const wrapper = document.createElement("div");
					wrapper.className = "table-wrapper";
					table.parentNode?.insertBefore(wrapper, table);
					wrapper.appendChild(table);
					table.classList.add("wrapped");
				}
			}
		};
		wrapTables();
		const tableObserver = new MutationObserver(() => {
			wrapTables();
		});
		tableObserver.observe(document.body, { childList: true, subtree: true });

		let resizeTimeout: ReturnType<typeof setTimeout>;
		const onResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(wrapTables, 100);
		};
		window.addEventListener("resize", onResize);

		return () => {
			copyButtons.forEach((button) => {
				button.removeEventListener("click", handleCopyClick);
			});
			copyObserver.disconnect();
			headings.forEach((h) => {
				h.removeEventListener("click", handleHeadingClick);
			});
			headingObserver.disconnect();
			tableObserver.disconnect();
			window.removeEventListener("resize", onResize);
		};
	}, []);

	return (
		<html lang="ja" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: THEME_INIT_SCRIPT,
					}}
				/>
				<HeadContent />
			</head>
			<body>
				<Theme appearance={theme} accentColor="indigo" radius="medium">
					<header className="glass-header">
						<div className="header-left">
							<a href="/" className="brand-link">
								<img src="/favicon.jpg" alt="もぐもぐ" className="brand-icon" />
								<span className="brand-text">もぐもぐ</span>
							</a>
							<nav>
								<a href="/blog" className="nav-link">
									Blog
								</a>
							</nav>
						</div>
						<div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
							<ThemeToggle />
						</div>
					</header>

					<main className="main-content">
						<Outlet />
					</main>

					{snackbar ? (
						<Snackbar message={snackbar.message} duration={snackbar.duration} />
					) : null}
				</Theme>
				<Scripts />
			</body>
		</html>
	);
}
