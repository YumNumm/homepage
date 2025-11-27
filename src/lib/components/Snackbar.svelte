<script lang="ts">
	let { message }: { message: string } = $props();
</script>

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
		transition: opacity 0.3s ease, transform 0.3s ease;
		pointer-events: none;
	"
>
	{message}
</div>

