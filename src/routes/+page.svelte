<script lang="ts">
import { page } from "$app/stores";
import { goto } from "$app/navigation";
import { onMount } from "svelte";
import { browser } from "$app/environment";
import DetailModal from "$lib/components/DetailModal.svelte";
import EQMonitorModal from "$lib/components/modals/EQMonitorModal.svelte";
import HighschoolModal from "$lib/components/modals/HighschoolModal.svelte";
import YumemiModal from "$lib/components/modals/YumemiModal.svelte";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();

// モーダルの状態
let currentDetail = $derived(
	browser ? $page.url.searchParams.get("detail") : null,
);

// モーダルを開く
const openModal = (detail: string) => {
	const url = new URL($page.url);
	url.searchParams.set("detail", detail);
	goto(url.pathname + url.search, { replaceState: false, noScroll: true });
};

// モーダルを閉じる
const closeModal = () => {
	const url = new URL($page.url);
	url.searchParams.delete("detail");
	goto(url.pathname + url.search, { replaceState: false, noScroll: true });
};

// カスタムイベントでモーダルを開く
onMount(() => {
	if (browser) {
		const handleDetailOpen = (event: CustomEvent<string>) => {
			openModal(event.detail);
		};
		window.addEventListener(
			"detail-modal-open",
			handleDetailOpen as EventListener,
		);
		return () => {
			window.removeEventListener(
				"detail-modal-open",
				handleDetailOpen as EventListener,
			);
		};
	}
});

// 各詳細の情報
const detailContents = {
	eqmonitor: {
		title: "EQMonitor - 地震速報アプリ",
	},
	highschool: {
		title: "横浜市立横浜サイエンスフロンティア高等学校",
	},
	yumemi: {
		title: "YUMEMI Inc.",
	},
} as const;

type DetailKey = keyof typeof detailContents;

const isValidDetail = (detail: string | null): detail is DetailKey => {
	return detail !== null && detail in detailContents;
};
</script>

{#if data.Content}
	<data.Content />
{/if}

{#if isValidDetail(currentDetail)}
	<DetailModal
		isOpen={true}
		onClose={closeModal}
		title={detailContents[currentDetail].title}
		icon={currentDetail === 'eqmonitor' ? '/EQMonitor_icon.webp' : undefined}
	>
		{#if currentDetail === 'eqmonitor'}
			<EQMonitorModal />
		{:else if currentDetail === 'highschool'}
			<HighschoolModal />
		{:else if currentDetail === 'yumemi'}
			<YumemiModal />
		{/if}
	</DetailModal>
{/if}
