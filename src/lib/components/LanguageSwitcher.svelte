<script lang="ts">
	import { isValidLanguage, type SupportedLanguage } from '$lib/i18n';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { currentLang }: { currentLang: SupportedLanguage } = $props();

	const languages: { code: SupportedLanguage; label: string }[] = [
		{ code: 'jp', label: 'JA' },
		{ code: 'en', label: 'EN' }
	];

	function switchLanguage(lang: SupportedLanguage) {
		if (lang === currentLang) return;

		const currentPath = $page.url.pathname;
		const pathWithoutLang = currentPath.replace(/^\/[^/]+/, '');
		const newPath = `/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
		goto(newPath);
	}
</script>

<nav style="display: flex; gap: 0.5rem; align-items: center;">
	{#each languages as langItem, index}
		<button
			type="button"
			onclick={() => switchLanguage(langItem.code)}
			style="
				background: transparent;
				border: none;
				cursor: pointer;
				padding: 0.25rem 0.5rem;
				font-family: inherit;
				transition: all 0.2s ease;
				{langItem.code === currentLang
					? `
						font-weight: 700;
						font-size: 1rem;
						color: var(--md-sys-color-on-surface);
					`
					: `
						font-weight: 400;
						font-size: 0.875rem;
						color: var(--md-sys-color-on-surface-variant);
						opacity: 0.7;
					`}
			"
			onmouseenter={(e) => {
				if (langItem.code !== currentLang) {
					e.currentTarget.style.opacity = '1';
				}
			}}
			onmouseleave={(e) => {
				if (langItem.code !== currentLang) {
					e.currentTarget.style.opacity = '0.7';
				}
			}}
		>
			{langItem.label}
		</button>
		{#if index < languages.length - 1}
			<span
				style="
					color: var(--md-sys-color-outline-variant);
					font-size: 0.875rem;
				"
			>
				/
			</span>
		{/if}
	{/each}
</nav>

