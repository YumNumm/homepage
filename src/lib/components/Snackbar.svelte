<script lang="ts">
	import { onMount } from 'svelte';

	let { message, duration = 3000 }: { message: string; duration?: number } = $props();

	let visible = $state(false);

	onMount(() => {
		visible = true;
		const timer = setTimeout(() => {
			visible = false;
		}, duration);

		return () => {
			clearTimeout(timer);
		};
	});
</script>

{#if visible}
	<div
		class="snackbar"
		style="
			position: fixed;
			bottom: 2rem;
			left: 50%;
			transform: translateX(-50%);
			background: var(--md-sys-color-surface-container-high);
			color: var(--md-sys-color-on-surface);
			padding: 1rem 1.5rem;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			z-index: 1000;
			opacity: {visible ? 1 : 0};
			transition: opacity 0.3s ease, transform 0.3s ease;
			pointer-events: none;
		"
	>
		{message}
	</div>
{/if}

