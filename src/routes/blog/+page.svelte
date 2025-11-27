<script lang="ts">
  import { onMount } from "svelte";
  import { app, type App } from "../api/[...paths]/app";
  import { hc } from "hono/client";

  const postsPromise = getPosts();
  async function getPosts() {
    const client = hc<App>("/");
    const response = await client.api.post.$get();
    return response.json();
  }
</script>

<h1 style="margin-bottom: 2rem; color: var(--color-text);">Blog</h1>

{#await postsPromise}
  <p>Loading...</p>
{:then posts}
  <ul>
    {#each posts as post}
      <li>{post.title}</li>
    {/each}
  </ul>
{/await}
