<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if data.Content}
	<article>
		<h1 style="margin-bottom: 1rem; color: var(--md-sys-color-on-background);">
			{data.post.title}
		</h1>
		{#if data.post.date}
			<time
				datetime={data.post.date}
				style="
					display: block;
					margin-bottom: 2rem;
					font-size: 0.875rem;
					color: var(--md-sys-color-on-surface-variant);
				"
			>
				{new Date(data.post.date).toLocaleDateString()}
			</time>
		{/if}
		<div style="color: var(--md-sys-color-on-surface);">
			<data.Content />
		</div>
	</article>
{/if}
