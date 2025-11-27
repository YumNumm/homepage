<script lang="ts">
  let {
    label,
    backgroundColor,
  }: { label: string; backgroundColor?: string } = $props();
</script>

<span
  class="tag"
  style={backgroundColor ? `background: ${backgroundColor};` : ""}
>
  {label}
</span>

<style>
  .tag {
    background: var(--color-surface);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    color: var(--color-text);
    display: inline-block;
  }

  :root[data-theme='dark'] .tag,
  [data-radix-theme='dark'] .tag {
    border: 1px solid var(--color-border);
  }
</style>
