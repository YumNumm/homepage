<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 style="margin-bottom: 2rem; color: var(--color-text);">Blog</h1>

{#if data.posts && data.posts.length > 0}
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
			<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
				{#if post.date}
					<time
						datetime={post.date}
						style="
							font-size: 0.875rem;
							color: var(--color-text-muted);
						"
					>
						{new Date(post.date).toLocaleDateString()}
					</time>
				{/if}
				{#if post.tags && post.tags.length > 0}
					<span style="font-size: 0.875rem; color: var(--color-text-muted); margin: 0 0.5rem;">•</span>
					<div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
						{#each post.tags as tag}
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
		</li>
		{/each}
	</ul>
{:else}
	<p style="color: var(--color-text-muted);">ブログ投稿がありません。</p>
{/if}
