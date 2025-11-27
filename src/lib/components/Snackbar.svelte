<script lang="ts">
	import { onMount } from 'svelte';

	let { message, duration = 1500 }: { message: string; duration?: number } = $props();

	let visible = $state(false);
	let fading = $state(false);

	onMount(() => {
		// 下からスライドイン
		visible = true;
		
		// フェードアウト開始
		const fadeTimer = setTimeout(() => {
			fading = true;
		}, duration);

		// 完全に非表示
		const hideTimer = setTimeout(() => {
			visible = false;
		}, duration + 300); // フェードアウトアニメーション時間を追加

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(hideTimer);
		};
	});
</script>

{#if visible}
	<div
		class="snackbar"
		style="
			position: fixed;
			bottom: {fading ? '-100px' : '2rem'};
			left: 50%;
			transform: translateX(-50%);
			background: var(--md-sys-color-surface-container-high);
			color: var(--md-sys-color-on-surface);
			padding: 1rem 1.5rem;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			z-index: 1000;
			opacity: {fading ? 0 : 1};
			transition: opacity 0.3s ease, bottom 0.3s ease;
			pointer-events: none;
		"
	>
		{message}
	</div>
{/if}
