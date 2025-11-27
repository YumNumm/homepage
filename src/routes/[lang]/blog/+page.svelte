<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 style="margin-bottom: 2rem; color: var(--md-sys-color-on-background);">Blog</h1>

<ul style="list-style: none; padding: 0;">
	{#each data.posts as post}
		<li
			style="
				margin-bottom: 1.5rem;
				padding: 1.5rem;
				background: var(--md-sys-color-surface-container-low);
				border-radius: 12px;
				border: 1px solid var(--md-sys-color-outline-variant);
				transition: all 0.2s ease;
			"
			onmouseenter={(e) => {
				e.currentTarget.style.background = 'var(--md-sys-color-surface-container)';
				e.currentTarget.style.borderColor = 'var(--md-sys-color-outline)';
			}}
			onmouseleave={(e) => {
				e.currentTarget.style.background = 'var(--md-sys-color-surface-container-low)';
				e.currentTarget.style.borderColor = 'var(--md-sys-color-outline-variant)';
			}}
		>
			<a
				href="/{data.lang}/blog/{post.slug}"
				style="
					display: block;
					font-size: 1.25rem;
					font-weight: 600;
					color: var(--md-sys-color-primary);
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
						color: var(--md-sys-color-on-surface-variant);
					"
				>
					{new Date(post.date).toLocaleDateString()}
				</time>
			{/if}
		</li>
	{/each}
</ul>

