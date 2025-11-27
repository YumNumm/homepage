<script lang="ts">
  import { page } from "$app/state";
  import { app, type App } from "../../api/[...paths]/app";
  import { hc } from "hono/client";

  async function getPost(slug: string) {
    const client = hc<App>("/");
    const response = await client.api.post.$get({ param: { slug } });
    return response.json();
  }

  const slug = $page.url.pathname.split("/").at(-1);
  if (!slug) {
    throw redirect(302, "/blog");
  }
  const postPromise = getPost(slug);
</script>

{#await postPromise}
  <p>Loading...</p>
{:then post}
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
{/await}
