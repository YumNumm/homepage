import type { Post } from "$lib/api/models/post";

export const metadata: Omit<Post, "slug"> = {
	title: "2025年を振り返る (プライベート編)",
	date: "2026-01-17",
	tags: ["プライベート"],
	published: false,
};

export default function Review2025PrivatePost() {
	return (
		<>
			<h2>下書き</h2>
			<p>（本文は追記予定）</p>
		</>
	);
}
