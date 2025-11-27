<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{@if data.content}
	<svelte:component this={data.content} />
{/if}

