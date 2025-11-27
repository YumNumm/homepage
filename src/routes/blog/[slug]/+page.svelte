<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if data.post}
	<h1 style="margin-bottom: 1rem; color: var(--color-text);">
		{data.post.title}
	</h1>
	{#if data.post.date}
		<time
			datetime={data.post.date}
			style="
				display: block;
				margin-bottom: 2rem;
				color: var(--color-text-muted);
			"
		>
			{new Date(data.post.date).toLocaleDateString()}
		</time>
	{/if}
{/if}

{#if data.Content}
	<data.Content />
{/if}
