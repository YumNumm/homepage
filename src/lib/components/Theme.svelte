<script lang="ts">
	import { themeStore } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	let theme = $state(themeStore.theme);

	onMount(() => {
		themeStore.init();
		theme = themeStore.theme;

		const unsubscribe = themeStore.subscribe((newTheme) => {
			theme = newTheme;
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<div data-radix-theme={theme} style="height: 100%;">
	{@render children()}
</div>
