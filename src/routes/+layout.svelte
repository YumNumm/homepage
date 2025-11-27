<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { themeStore } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Snackbar from '$lib/components/Snackbar.svelte';

	let { children } = $props();

	let snackbarMessage = $state('');
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
			// 見出しのクリックイベントをハンドル
			const handleHeadingClick = (event: MouseEvent) => {
				const target = event.currentTarget as HTMLElement;
				if (!target) return;

				const id = target.id;
				if (!id) return;

				const url = new URL(window.location.href);
				url.hash = id;
				const urlString = url.toString();

				// URLをコピー
				navigator.clipboard
					.writeText(urlString)
					.then(() => {
						// 見出しにスクロール
						target.scrollIntoView({ behavior: 'smooth', block: 'start' });
						// URLを更新（ハッシュを追加）
						window.history.pushState(null, '', urlString);
						// Snackbarを表示
						showSnackbarMessage('URLをコピーしました');
					})
					.catch((err) => {
						console.error('Failed to copy URL:', err);
						showSnackbarMessage('URLのコピーに失敗しました');
					});
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

{@render children()}

{#if showSnackbar}
	<Snackbar message={snackbarMessage} duration={snackbarDuration} />
{/if}
