import type { ComponentType } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import * as v from "valibot";
import type { Post } from "$lib/api/models/post";
import { PostSchema } from "$lib/api/models/post";
import {
	collectPublishedPosts,
	getAllPostModules,
} from "$lib/posts/collectPosts";

const yearPattern = /^\d{4}$/;
const yearMonthPattern = /^\d{4}\/\d{2}$/;

type BlogListLoaderData = {
	type: "list";
	posts: ReturnType<typeof collectPublishedPosts>;
	year: string;
	month: string | null;
};

type BlogPostLoaderData = {
	type: "post";
	post: Post;
	Content: ComponentType;
};

type BlogLoaderData = BlogListLoaderData | BlogPostLoaderData;

export const Route = createFileRoute("/blog/$")({
	loader: async ({ params }): Promise<BlogLoaderData> => {
		const slug = params._splat;
		if (!slug) throw notFound();

		const paths = getAllPostModules();

		if (yearPattern.test(slug) || yearMonthPattern.test(slug)) {
			const published = collectPublishedPosts(paths);
			const filtered = published.filter((p) => p.slug.startsWith(`${slug}/`));
			if (filtered.length === 0) throw notFound();
			const parts = slug.split("/");
			const year = parts[0];
			const month = parts[1] ?? null;
			const listData: BlogListLoaderData = {
				type: "list",
				posts: filtered,
				year,
				month,
			};
			return listData;
		}

		const postPathTsx = `/src/content/blog/${slug}.tsx`;
		const postPathTs = `/src/content/blog/${slug}.ts`;
		const mod = paths[postPathTsx] ?? paths[postPathTs];
		if (!mod || typeof mod !== "object" || !("metadata" in mod)) {
			throw notFound();
		}

		const metadata = mod.metadata as Omit<Post, "slug">;
		const post = v.parse(PostSchema, { ...metadata, slug });
		const Content = mod.default as ComponentType;

		const postData: BlogPostLoaderData = {
			type: "post",
			post,
			Content,
		};
		return postData;
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		if (loaderData.type === "list") {
			const title =
				loaderData.month != null
					? `${loaderData.year}年${Number.parseInt(loaderData.month, 10)}月の記事`
					: `${loaderData.year}年の記事`;
			const desc =
				loaderData.month != null
					? `${loaderData.year}年${Number.parseInt(loaderData.month, 10)}月のブログ記事一覧`
					: `${loaderData.year}年のブログ記事一覧`;
			return {
				meta: [
					{ title: `${title} - もぐもぐのサイト` },
					{ name: "description", content: desc },
				],
			};
		}
		const p = loaderData.post;
		const desc = p.description ?? `${p.title} - もぐもぐのサイト`;
		const og = `https://yumnumm.dev/og/blog/${p.slug}.png`;
		const metas: Array<Record<string, string>> = [
			{ title: `${p.title} - もぐもぐのサイト` },
			{ name: "description", content: desc },
			{ property: "og:title", content: p.title },
			{ property: "og:description", content: desc },
			{ property: "og:image", content: og },
			{ property: "og:url", content: `https://yumnumm.dev/blog/${p.slug}` },
			{ property: "og:type", content: "article" },
			{ property: "og:site_name", content: "もぐもぐのサイト" },
			{ property: "article:published_time", content: p.date },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: p.title },
			{ name: "twitter:description", content: desc },
			{ name: "twitter:image", content: og },
		];
		for (const tag of p.tags ?? []) {
			metas.push({ property: "article:tag", content: tag });
		}
		return { meta: metas };
	},
	component: BlogSplatPage,
});

function BlogSplatPage() {
	const data = Route.useLoaderData();

	if (data.type === "list") {
		const pageTitle =
			data.month != null
				? `${data.year}年${Number.parseInt(data.month, 10)}月の記事`
				: `${data.year}年の記事`;

		return (
			<>
				<div style={{ marginBottom: "2rem" }}>
					{data.month ? (
						<a href={`/blog/${data.year}`}>← {data.year}年の記事一覧に戻る</a>
					) : (
						<a href="/blog">← ブログ一覧に戻る</a>
					)}
				</div>

				<h1 style={{ marginBottom: "2rem", color: "var(--color-text)" }}>
					{pageTitle}
				</h1>

				{data.posts.length > 0 ? (
					<ul className="post-list">
						{data.posts.map((post) => (
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
											<span key={tag} className="blog-tag">
												{tag}
											</span>
										))}
									</div>
								) : null}
							</li>
						))}
					</ul>
				) : (
					<p>この期間のブログ投稿はありません。</p>
				)}
			</>
		);
	}

	const { post, Content } = data;

	return (
		<>
			<div style={{ marginBottom: "2rem" }}>
				<a href="/blog">← ブログ一覧に戻る</a>
			</div>

			<article>
				<header className="blog-header">
					<h1>{post.title}</h1>
					<div className="blog-meta">
						<time>{new Date(post.date).toLocaleDateString("ja-JP")}</time>
						{post.tags && post.tags.length > 0 ? (
							<div className="blog-tags">
								{post.tags.map((tag) => (
									<span key={tag} className="blog-tag">
										{tag}
									</span>
								))}
							</div>
						) : null}
					</div>
					{post.description ? (
						<p className="blog-description">{post.description}</p>
					) : null}
				</header>

				<div className="blog-content">
					<Content />
				</div>
			</article>
		</>
	);
}
