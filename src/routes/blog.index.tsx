import { createFileRoute } from "@tanstack/react-router";
import {
	collectPublishedPosts,
	getAllPostModules,
} from "$lib/posts/collectPosts";

export const Route = createFileRoute("/blog/")({
	loader: () => ({
		posts: collectPublishedPosts(getAllPostModules()),
	}),
	head: () => ({
		meta: [
			{ title: "Blog - もぐもぐのサイト" },
			{ name: "description", content: "ブログ記事一覧" },
		],
	}),
	component: BlogIndexPage,
});

function BlogIndexPage() {
	const { posts } = Route.useLoaderData();

	return (
		<>
			<h1 style={{ marginBottom: "2rem", color: "var(--color-text)" }}>Blog</h1>

			{posts.length > 0 ? (
				<ul>
					{posts.map((post) => (
						<li key={post.slug}>
							<a href={`/blog/${post.slug}`}>{post.title}</a>
							<span
								style={{
									color: "var(--color-text-muted)",
									marginLeft: "1rem",
								}}
							>
								{new Date(post.date).toLocaleDateString("ja-JP")}
							</span>
							{post.tags && post.tags.length > 0 ? (
								<div style={{ marginTop: "0.5rem" }}>
									{post.tags.map((tag) => (
										<span
											key={tag}
											style={{
												background: "var(--color-surface)",
												padding: "0.25rem 0.5rem",
												borderRadius: "4px",
												marginRight: "0.5rem",
												fontSize: "0.875rem",
											}}
										>
											{tag}
										</span>
									))}
								</div>
							) : null}
						</li>
					))}
				</ul>
			) : (
				<p>ブログ投稿がありません。</p>
			)}
		</>
	);
}
