import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "$lib/components/home/HomePage";

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => ({
		detail: typeof search.detail === "string" ? search.detail : undefined,
	}),
	head: () => ({
		meta: [
			{ title: "もぐもぐのサイト" },
			{
				name: "description",
				content: "Ryotaro Onoue (もぐもぐ) のポートフォリオ",
			},
		],
	}),
	component: HomePage,
});
