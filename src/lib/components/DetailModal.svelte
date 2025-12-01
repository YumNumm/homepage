<script lang="ts">
import { fade, fly } from "svelte/transition";
import { cubicOut } from "svelte/easing";
import { onMount } from "svelte";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	icon?: string;
	children?: import("svelte").Snippet;
}

let { isOpen, onClose, title, icon, children }: Props = $props();

let modalContainer: HTMLDivElement | undefined = $state();
let portalTarget: HTMLElement | undefined = $state();

onMount(() => {
	// モーダルをbody直下に移動
	portalTarget = document.body;
	if (modalContainer && portalTarget) {
		portalTarget.appendChild(modalContainer);
	}

	return () => {
		// クリーンアップ: モーダルをDOMから削除
		if (modalContainer && portalTarget?.contains(modalContainer)) {
			portalTarget.removeChild(modalContainer);
		}
	};
});

function handleKeydown(event: KeyboardEvent) {
	if (event.key === "Escape") {
		onClose();
	}
}

function handleBackdropClick(event: MouseEvent) {
	if (event.target === event.currentTarget) {
		onClose();
	}
}
</script>

<svelte:window onkeydown={handleKeydown} />

<div bind:this={modalContainer} style="display: contents;">
	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="modal-backdrop"
			onclick={handleBackdropClick}
			transition:fade={{ duration: 300 }}
		>
		<div
			class="modal-content"
			transition:fly={{ y: 50, duration: 400, easing: cubicOut }}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
		<div class="modal-header">
			<div class="modal-header-content">
				{#if icon}
					<img src={icon} alt="" class="modal-icon" />
				{/if}
				<h2 id="modal-title">{title}</h2>
			</div>
			<button class="close-button" onclick={onClose} aria-label="閉じる">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>
			<div class="modal-body">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
	{/if}
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.modal-content {
		position: relative;
		width: 100%;
		max-width: 800px;
		max-height: 85vh;
		overflow-y: auto;
		background: var(--color-surface);
		border-radius: 16px;
		border: 1px solid var(--color-border);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.modal-header {
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 2rem;
		background: color-mix(in srgb, var(--color-surface) 70%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--color-border);
		border-radius: 16px 16px 0 0;
		z-index: 1;
	}

	.modal-header-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
	}

	.modal-icon {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.modal-header h2 {
		margin: 0;
		padding-left: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.modal-header h2::before {
		content: none;
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		padding: 0;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		color: var(--color-text);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: var(--color-surface-hover);
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.close-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.modal-body {
		padding: 2rem;
	}

	/* モーダル内のコンテンツスタイル調整 */
	.modal-body :global(h3) {
		margin-top: 1rem;
	}

	.modal-body :global(h3:first-child) {
		margin-top: 0;
	}

	.modal-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 12px;
		margin: 1rem 0;
	}

	.modal-body :global(p) {
		line-height: 1.8;
		margin-bottom: 1rem;
	}

	.modal-body :global(ul) {
		margin-bottom: 1rem;
	}

	.modal-body :global(li) {
		margin-bottom: 0.5rem;
	}

	/* レスポンシブ対応 */
	@media (max-width: 640px) {
		.modal-content {
			max-height: 90vh;
			border-radius: 12px;
		}

		.modal-header {
			padding: 1rem 1.5rem;
			border-radius: 12px 12px 0 0;
		}

		.modal-header h2 {
			font-size: 1.25rem;
		}

		.modal-body {
			padding: 1.5rem;
		}
	}
</style>
