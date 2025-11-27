import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Post } from "$lib/api/models/post";
import type { Component } from "svelte";
import * as v from "valibot";
import { PostSchema } from "$lib/api/models/post";

export const prerender = true;

export async function entries() {
  const paths = import.meta.glob<{
    default: Component;
    metadata: Omit<Post, "slug">;
  }>("/src/content/blog/**/*.{svx,md}", {
    eager: true,
  });
  const slugs: string[] = [];

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
        slugs.push(slug);
      }
    }
  }

  return slugs.map((slug) => ({ slug }));
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
  const postPath = `/src/content/blog/${slug}.svx`;
  const postFile = paths[postPath] || paths[`/src/content/blog/${slug}.md`];

  if (!postFile || typeof postFile !== "object" || !("metadata" in postFile)) {
    throw error(404, "Post not found");
  }

  const metadata = postFile.metadata as Omit<Post, "slug">;
  const post = v.parse(PostSchema, { ...metadata, slug });

  if (!post.published) {
    throw error(404, "Post not found");
  }

  return {
    post: {
      ...post,
      Content: postFile.default,
    },
  };
};
