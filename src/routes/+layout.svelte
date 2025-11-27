<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { themeStore } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();

	let snackbarMessage = $state('');
	let snackbarDuration = $state(1500);
	let showSnackbar = $state(false);

	const showSnackbarMessage = (message: string, duration = 1500) => {
		snackbarMessage = message;
		snackbarDuration = duration;
		showSnackbar = true;
		setTimeout(() => {
			showSnackbar = false;
		}, duration + 300); // フェードアウトアニメーション時間を追加
	};

	onMount(() => {
		themeStore.init();

		if (browser) {
			// コードブロックのコピーボタンのイベントをハンドル
			const handleCopyClick = async (event: MouseEvent) => {
				const button = event.currentTarget as HTMLButtonElement;
				if (!button) return;

				const codeId = button.getAttribute('data-code-id');
				if (!codeId) return;

				const codeElement = document.getElementById(codeId);
				if (!codeElement) return;

				// コードテキストを取得（pre要素内のcode要素をテキストとして取得）
				const codeText = codeElement.querySelector('code')?.textContent || codeElement.textContent || '';

				try {
					await navigator.clipboard.writeText(codeText);
					// 一時的にボタンのアイコンを変更
					const originalHTML = button.innerHTML;
					button.innerHTML = `
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					`;
					setTimeout(() => {
						button.innerHTML = originalHTML;
					}, 2000);
					showSnackbarMessage('コードをコピーしました');
				} catch (err) {
					console.error('Failed to copy code:', err);
					showSnackbarMessage('コードのコピーに失敗しました');
				}
			};

			// すべてのコピーボタンにイベントリスナーを追加
			const copyButtons = document.querySelectorAll('.code-block-copy');
			copyButtons.forEach((button) => {
				button.addEventListener('click', handleCopyClick);
			});

			// MutationObserverで動的に追加されるコピーボタンにも対応
			const copyObserver = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							const element = node as HTMLElement;
							if (element.matches('.code-block-copy')) {
								element.addEventListener('click', handleCopyClick);
							}
							// 子要素の中にもコピーボタンがある場合
							const childButtons = element.querySelectorAll('.code-block-copy');
							childButtons.forEach((button) => {
								button.addEventListener('click', handleCopyClick);
							});
						}
					});
				});
			});

			copyObserver.observe(document.body, {
				childList: true,
				subtree: true
			});

			// 見出しのクリックイベントをハンドル
			const handleHeadingClick = async (event: Event) => {
				const target = event.currentTarget as HTMLElement;
				if (!target) return;

				const id = target.id;
				if (!id) return;

				const url = new URL(window.location.href);
				url.hash = id;
				const urlString = url.toString();

				// URLをコピー
				await navigator.clipboard
					.writeText(urlString)
						// 見出しにスクロール
						target.scrollIntoView({ behavior: 'smooth', block: 'start' });
						// URLを更新（ハッシュを追加）
						replaceState(url, {});
						// Snackbarを表示
						showSnackbarMessage('URLをコピーしました');

			};

			// すべての見出しにイベントリスナーを追加
			const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
			headings.forEach((heading) => {
				heading.addEventListener('click', handleHeadingClick);
			});

			// MutationObserverで動的に追加される見出しにも対応
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							const element = node as HTMLElement;
							if (element.matches('h1, h2, h3, h4, h5, h6')) {
								element.addEventListener('click', handleHeadingClick);
							}
							// 子要素の中にも見出しがある場合
							const childHeadings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
							childHeadings.forEach((heading) => {
								heading.addEventListener('click', handleHeadingClick);
							});
						}
					});
				});
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});

			// クリーンアップ
			return () => {
				copyButtons.forEach((button) => {
					button.removeEventListener('click', handleCopyClick);
				});
				copyObserver.disconnect();
				headings.forEach((heading) => {
					heading.removeEventListener('click', handleHeadingClick);
				});
				observer.disconnect();
			};
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header
	style="
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: var(--md-sys-color-surface-container-low);
		border-bottom: 1px solid var(--md-sys-color-outline-variant);
	"
>
	<nav>
		<a href="/" style="margin-right: 1rem;">Home</a>
		<a href="/blog" style="margin-right: 1rem;">Blog</a>
	</nav>
	<div style="display: flex; gap: 1rem; align-items: center;">
		<ThemeToggle />
	</div>
</header>

<main style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
	{@render children()}
</main>

{#if showSnackbar}
	<Snackbar message={snackbarMessage} duration={snackbarDuration} />
{/if}
