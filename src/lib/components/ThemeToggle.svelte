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
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 8px 16px;
		cursor: pointer;
		color: var(--color-text);
		font-family: inherit;
		transition: all 0.2s ease;
	"
	onmouseenter={(e) => {
		e.currentTarget.style.background = 'var(--color-surface-hover)';
		e.currentTarget.style.borderColor = 'var(--color-accent)';
	}}
	onmouseleave={(e) => {
		e.currentTarget.style.background = 'var(--color-surface)';
		e.currentTarget.style.borderColor = 'var(--color-border)';
	}}
>
	{theme === 'light' ? '🌙' : '☀️'}
</button>
