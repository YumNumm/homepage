<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 style="margin-bottom: 2rem; color: var(--color-text);">Blog</h1>

<ul style="list-style: none; padding: 0;">
	{#each data.posts as post}
		<li
			style="
				margin-bottom: 1.5rem;
				padding: 1.5rem;
				background: var(--color-surface);
				border-radius: 12px;
				border: 1px solid var(--color-border);
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
			<a
				href={`/blog/${post.slug}`}
				style="
					display: block;
					font-size: 1.25rem;
					font-weight: 600;
					color: var(--color-accent);
					margin-bottom: 0.5rem;
					text-decoration: none;
				"
			>
				{post.title}
			</a>
			{#if post.date}
				<time
					datetime={post.date}
					style="
						display: block;
						font-size: 0.875rem;
						color: var(--color-text-muted);
					"
				>
					{new Date(post.date).toLocaleDateString()}
				</time>
			{/if}
		</li>
	{/each}
</ul>
