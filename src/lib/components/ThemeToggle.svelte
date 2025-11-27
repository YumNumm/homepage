<script lang="ts">
	import { themeStore } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let theme = $state(themeStore.theme);

	onMount(() => {
		themeStore.init();
		theme = themeStore.theme;
	});

	function toggleTheme() {
		themeStore.toggle();
		theme = themeStore.theme;
	}
</script>

<button
	type="button"
	onclick={toggleTheme}
	aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	style="
		background: var(--md-sys-color-surface-container-high);
		border: 1px solid var(--md-sys-color-outline);
		border-radius: 8px;
		padding: 8px 16px;
		cursor: pointer;
		color: var(--md-sys-color-on-surface);
		font-family: inherit;
		transition: all 0.2s ease;
	"
	onmouseenter={(e) => {
		e.currentTarget.style.background = 'var(--md-sys-color-surface-container-highest)';
	}}
	onmouseleave={(e) => {
		e.currentTarget.style.background = 'var(--md-sys-color-surface-container-high)';
	}}
>
	{theme === 'light' ? '🌙' : '☀️'}
</button>
