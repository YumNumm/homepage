<script lang="ts">
	import '../../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import type { LayoutData } from './$types';

	let { lang, children }: LayoutData = $props();
</script>

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
		<a href={/${lang}} style="margin-right: 1rem;">Home</a>
		<a href={/${lang}/blog} style="margin-right: 1rem;">Blog</a>
	</nav>
	<div style="display: flex; gap: 1rem; align-items: center;">
		<LanguageSwitcher currentLang={lang} />
		<ThemeToggle />
	</div>
</header>

<main style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
	{@render children()}
</main>
