import type { PageLoad } from "./$types";
import type { Post } from "$lib/api/models/post";
import type { Component } from "svelte";
import * as v from "valibot";
import { PostSchema } from "$lib/api/models/post";

export const prerender = true;

export const load: PageLoad = async () => {
  const paths = import.meta.glob<{
    default: Component;
    metadata: Omit<Post, "slug">;
  }>("/src/content/blog/**/*.{svx,md}", {
    eager: true,
  });
  const posts: Post[] = [];

  for (const path in paths) {
    const file = paths[path];
    const slug = path
      .split("/")
      .at(-1)
      ?.replace(/\.(md|svx)$/, "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<Post, "slug">;
      const post = v.parse(PostSchema, { ...metadata, slug });
      if (post.published) {
        posts.push(post);
      }
    }
  }

  // 日付でソート（新しい順）
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    posts,
  };
};
