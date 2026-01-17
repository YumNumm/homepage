<script lang="ts">
import type { PageData } from "./$types";

const { data }: { data: PageData } = $props();

const siteUrl = "https://yumnumm.dev";

// ページタイトルと説明
const pageTitle = $derived(
	data.type === "list"
		? data.month
			? `${data.year}年${parseInt(data.month)}月の記事`
			: `${data.year}年の記事`
		: data.post.title
);

const pageDescription = $derived(
	data.type === "list"
		? data.month
			? `${data.year}年${parseInt(data.month)}月のブログ記事一覧`
			: `${data.year}年のブログ記事一覧`
		: data.post.description || `${data.post.title} - もぐもぐのサイト`
);

// 記事ページ用のOG情報
const ogImageUrl = $derived(
	data.type === "post" ? `${siteUrl}/og/blog/${data.post.slug}.png` : null
);
const pageUrl = $derived(
	data.type === "post" ? `${siteUrl}/blog/${data.post.slug}` : null
);
</script>

<svelte:head>
	<title>{pageTitle} - もぐもぐのサイト</title>
	<meta name="description" content={pageDescription} />

	{#if data.type === "post"}
		<!-- Open Graph -->
		<meta property="og:title" content={pageTitle} />
		<meta property="og:description" content={pageDescription} />
		<meta property="og:image" content={ogImageUrl} />
		<meta property="og:url" content={pageUrl} />
		<meta property="og:type" content="article" />
		<meta property="og:site_name" content="もぐもぐのサイト" />
		<meta property="article:published_time" content={data.post.date} />
		{#if data.post.tags}
			{#each data.post.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}

		<!-- Twitter Card -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={pageTitle} />
		<meta name="twitter:description" content={pageDescription} />
		<meta name="twitter:image" content={ogImageUrl} />
	{/if}
</svelte:head>

{#if data.type === "list"}
	<div style="margin-bottom: 2rem;">
		{#if data.month}
			<a href={`/blog/${data.year}`}>← {data.year}年の記事一覧に戻る</a>
		{:else}
			<a href="/blog">← ブログ一覧に戻る</a>
		{/if}
	</div>

	<h1 style="margin-bottom: 2rem; color: var(--color-text);">{pageTitle}</h1>

	{#if data.posts && data.posts.length > 0}
		<ul class="post-list">
			{#each data.posts as post}
				<li>
					<a href={`/blog/${post.slug}`}>
						{post.title}
					</a>
					<span style="color: var(--color-text-muted); margin-left: 1rem;">
						{new Date(post.date).toLocaleDateString("ja-JP")}
					</span>
					{#if post.tags && post.tags.length > 0}
						<div style="margin-top: 0.5rem;">
							{#each post.tags as tag}
								<span class="blog-tag">{tag}</span>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p>この期間のブログ投稿はありません。</p>
	{/if}
{:else if data.type === "post"}
	<div style="margin-bottom: 2rem;">
		<a href="/blog">← ブログ一覧に戻る</a>
	</div>

	<article>
		<header class="blog-header">
			<h1>{data.post.title}</h1>
			<div class="blog-meta">
				<time>{new Date(data.post.date).toLocaleDateString("ja-JP")}</time>
				{#if data.post.tags && data.post.tags.length > 0}
					<div class="blog-tags">
						{#each data.post.tags as tag}
							<span class="blog-tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</div>
			{#if data.post.description}
				<p class="blog-description">{data.post.description}</p>
			{/if}
		</header>

		<div class="blog-content">
			{#if data.post.Content}
				<data.post.Content />
			{/if}
		</div>
	</article>
{/if}

<style>
	.post-list {
		list-style: none;
		padding: 0;
	}

	.post-list li {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.post-list a {
		font-size: 1.125rem;
		font-weight: 500;
	}

	.blog-header {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		position: relative;
		background: var(--color-background-start) !important;
	}

	.blog-header::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(
			to right,
			var(--color-background-start) 0%,
			var(--color-accent) 20%,
			var(--color-accent) 80%,
			var(--color-background-start) 100%
		);
	}

	.blog-header h1 {
		margin-bottom: 0.75rem;
		color: var(--color-text);
	}

	.blog-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.blog-meta time {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
	}

	.blog-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.blog-tag {
		background: var(--color-surface);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		color: var(--color-text);
		display: inline-block;
		margin-right: 0.5rem;
	}

	:root[data-theme="dark"] .blog-tag,
	[data-radix-theme="dark"] .blog-tag {
		border: 1px solid var(--color-border);
	}

	.blog-description {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		margin-top: 0.5rem;
	}

	.blog-content {
		color: var(--color-text);
	}
</style>
