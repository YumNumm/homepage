<script lang="ts">
import type { PageData } from "./$types";

const { data }: { data: PageData } = $props();

const siteUrl = "https://yumnumm.dev";
const ogImageUrl = `${siteUrl}/og/blog/${data.post.slug}.png`;
const pageUrl = `${siteUrl}/blog/${data.post.slug}`;
const title = data.post.title;
const description =
	data.post.description || `${data.post.title} - もぐもぐのサイト`;
</script>

<svelte:head>
	<title>{title} - もぐもぐのサイト</title>
	<meta name="description" content={description} />

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
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
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

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

<style>
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
