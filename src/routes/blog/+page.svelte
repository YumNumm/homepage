<script lang="ts">
import type { PageData } from "./$types";

const { data }: { data: PageData } = $props();
</script>

<h1 style="margin-bottom: 2rem; color: var(--color-text);">Blog</h1>

{#if data.posts && data.posts.length > 0}
  <ul>
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
              <span
                style="
                  background: var(--color-surface);
                  padding: 0.25rem 0.5rem;
                  border-radius: 4px;
                  margin-right: 0.5rem;
                  font-size: 0.875rem;
                "
              >
                {tag}
              </span>
            {/each}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{:else}
  <p>ブログ投稿がありません。</p>
{/if}
