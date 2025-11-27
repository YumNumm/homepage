<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if data.post}
	<h1 style="margin-bottom: 1rem; color: var(--color-text);">
		{data.post.title}
	</h1>
	<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 2rem;">
		{#if data.post.date}
			<time
				datetime={data.post.date}
				style="
					font-size: 0.875rem;
					color: var(--color-text-muted);
				"
			>
				{new Date(data.post.date).toLocaleDateString()}
			</time>
		{/if}
		{#if data.post.tags && data.post.tags.length > 0}
			<span style="font-size: 0.875rem; color: var(--color-text-muted); margin: 0 0.5rem;">•</span>
			<div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
				{#each data.post.tags as tag}
					<span
						style="
							font-size: 0.75rem;
							padding: 0.25rem 0.5rem;
							background: var(--color-surface-hover);
							border: 1px solid var(--color-border);
							border-radius: 4px;
							color: var(--color-text-muted);
						"
					>
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</div>
{/if}

{#if data.Content}
	<data.Content />
{/if}
