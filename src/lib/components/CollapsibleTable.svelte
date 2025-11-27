<script lang="ts">
  import { onMount } from "svelte";

  let { initialRows = 3 }: { initialRows?: number } = $props();
  let expanded = $state(false);
  let wrapperElement: HTMLDivElement | null = $state(null);
  let tableElement: HTMLTableElement | null = $state(null);
  let rows: HTMLTableRowElement[] = $state([]);
  let showButton = $state(false);

  onMount(() => {
    if (!tableElement) return;

    const tbody = tableElement.querySelector("tbody");
    if (!tbody) return;

    const tbodyRows = Array.from(tbody.querySelectorAll("tr"));
    rows = tbodyRows;
    showButton = rows.length > initialRows;

    if (!expanded && rows.length > initialRows) {
      tbodyRows.slice(initialRows).forEach((row) => {
        (row as HTMLElement).style.display = "none";
      });
    }
  });

  function toggle() {
    if (!tableElement) return;

    const tbody = tableElement.querySelector("tbody");
    if (!tbody) return;

    expanded = !expanded;

    if (expanded) {
      rows.forEach((row) => {
        (row as HTMLElement).style.display = "";
      });
    } else {
      rows.slice(initialRows).forEach((row) => {
        (row as HTMLElement).style.display = "none";
      });
    }
  }
</script>

<div class="collapsible-table-wrapper" bind:this={wrapperElement}>
  <slot />
  {#if showButton && !expanded}
    <div class="fade-overlay">
      <button class="show-more-button" onclick={toggle}>
        さらに表示
      </button>
    </div>
  {/if}
</div>

<style>
  .collapsible-table-wrapper {
    position: relative;
    margin-bottom: 1.5rem;
  }

  :global(.collapsible-table-wrapper table) {
    position: relative;
  }

  .fade-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      var(--color-surface) 40%,
      var(--color-surface) 60%,
      var(--color-surface) 100%
    );
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .show-more-button {
    pointer-events: all;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    color: var(--color-text);
    cursor: pointer;
    font-family: 'JetBrains Mono', 'Noto Sans JP', monospace;
    font-size: 0.875rem;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .show-more-button:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-accent);
  }

  :root[data-theme='dark'] .fade-overlay,
  [data-radix-theme='dark'] .fade-overlay {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      var(--color-surface) 40%,
      var(--color-surface) 60%,
      var(--color-surface) 100%
    );
  }

  :root[data-theme='dark'] .show-more-button,
  [data-radix-theme='dark'] .show-more-button {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
</style>
