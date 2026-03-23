import type { ComponentType } from "react";
import * as v from "valibot";
import type { Post } from "$lib/api/models/post";
import { PostSchema } from "$lib/api/models/post";

export type PostMdxModule = {
	default: ComponentType;
	metadata: Omit<Post, "slug">;
};

export function collectPublishedPosts(
	paths: Record<string, PostMdxModule>,
): Post[] {
	const posts: Post[] = [];

	for (const path in paths) {
		const slug = path
			.replace("/src/content/blog/", "")
			.replace(/\.(tsx|ts|mdx|md)$/, "");
		const file = paths[path];
		if (file && typeof file === "object" && "metadata" in file && slug) {
			const metadata = file.metadata as Omit<Post, "slug">;
			const post = v.parse(PostSchema, { ...metadata, slug });
			if (post.published) {
				posts.push(post);
			}
		}
	}

	posts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return posts;
}

export function getAllPostModules() {
	return import.meta.glob<PostMdxModule>("/src/content/blog/**/*.{tsx,ts}", {
		eager: true,
	});
}

/** 公開・非公開を含む（個別記事表示用） */
export function collectAllPosts(paths: Record<string, PostMdxModule>): Post[] {
	const posts: Post[] = [];

	for (const path in paths) {
		const slug = path
			.replace("/src/content/blog/", "")
			.replace(/\.(tsx|ts|mdx|md)$/, "");
		const file = paths[path];
		if (file && typeof file === "object" && "metadata" in file && slug) {
			const metadata = file.metadata as Omit<Post, "slug">;
			posts.push(v.parse(PostSchema, { ...metadata, slug }));
		}
	}

	posts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return posts;
}
