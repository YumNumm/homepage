import { error } from "@sveltejs/kit";
import type { Component } from "svelte";
import * as v from "valibot";
import type { Post } from "$lib/api/models/post";
import { PostSchema } from "$lib/api/models/post";
import type { PageLoad } from "./$types";

export const prerender = true;

// 年のみのパターン (例: 2026)
const yearPattern = /^\d{4}$/;
// 年/月のパターン (例: 2026/01)
const yearMonthPattern = /^\d{4}\/\d{2}$/;

function getAllPosts(paths: Record<string, { default: Component; metadata: Omit<Post, "slug"> }>): Post[] {
	const posts: Post[] = [];

	for (const path in paths) {
		const file = paths[path];
		const slug = path
			.replace("/src/content/blog/", "")
			.replace(/\.(md|svx)$/, "");

		if (file && typeof file === "object" && "metadata" in file && slug) {
			const metadata = file.metadata as Omit<Post, "slug">;
			const post = v.parse(PostSchema, { ...metadata, slug });
			if (post.published) {
				posts.push(post);
			}
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function entries() {
	const paths = import.meta.glob<{
		default: Component;
		metadata: Omit<Post, "slug">;
	}>("/src/content/blog/**/*.{svx,md}", {
		eager: true,
	});

	const slugs: string[] = [];
	const directories = new Set<string>();

	for (const path in paths) {
		const file = paths[path];
		const slug = path
			.replace("/src/content/blog/", "")
			.replace(/\.(md|svx)$/, "");

		if (file && typeof file === "object" && "metadata" in file && slug) {
			const metadata = file.metadata as Omit<Post, "slug">;
			const post = v.parse(PostSchema, { ...metadata, slug });
			if (post.published) {
				slugs.push(slug);

				// ディレクトリパスも収集 (例: 2026/01/post -> 2026, 2026/01)
				const parts = slug.split("/");
				if (parts.length >= 2) {
					directories.add(parts[0]); // 年
				}
				if (parts.length >= 3) {
					directories.add(`${parts[0]}/${parts[1]}`); // 年/月
				}
			}
		}
	}

	// 記事のslugとディレクトリパスを結合
	const allSlugs = [...slugs, ...directories];
	return allSlugs.map((slug) => ({ slug }));
}

export const load: PageLoad = async (event) => {
	const slug = event.params.slug;

	if (!slug) {
		throw error(404, "Post not found");
	}

	const paths = import.meta.glob<{
		default: Component;
		metadata: Omit<Post, "slug">;
	}>("/src/content/blog/**/*.{svx,md}", {
		eager: true,
	});

	// 年または年/月のパターンの場合は一覧を返す
	if (yearPattern.test(slug) || yearMonthPattern.test(slug)) {
		const allPosts = getAllPosts(paths);
		const filteredPosts = allPosts.filter((post) => post.slug.startsWith(`${slug}/`));

		if (filteredPosts.length === 0) {
			throw error(404, "No posts found");
		}

		// パスの解析
		const parts = slug.split("/");
		const year = parts[0];
		const month = parts[1] || null;

		return {
			type: "list" as const,
			posts: filteredPosts,
			year,
			month,
		};
	}

	// 個別記事の場合
	const postPath = `/src/content/blog/${slug}.svx`;
	const postPathMd = `/src/content/blog/${slug}.md`;
	const postFile = paths[postPath] || paths[postPathMd];

	if (!postFile || typeof postFile !== "object" || !("metadata" in postFile)) {
		throw error(404, "Post not found");
	}

	const metadata = postFile.metadata as Omit<Post, "slug">;
	const post = v.parse(PostSchema, { ...metadata, slug });

	return {
		type: "post" as const,
		post: {
			...post,
			Content: postFile.default,
		},
	};
};
