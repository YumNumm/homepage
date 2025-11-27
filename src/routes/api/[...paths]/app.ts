import { Hono } from "hono";
import { hc } from "hono/client";
import type { Post } from "./models/post";
import * as v from "valibot";
import { PostSchema } from "./models/post";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { vValidator } from "@hono/valibot-validator";

async function getPosts(): Promise<Post[]> {
  const posts: Post[] = [];

  const paths = import.meta.glob("/src/content/blog/**/*", { eager: true });
  console.log(paths);

  for (const path in paths) {
    const file = paths[path];
    const slug = path
      .split("/")
      .at(-1)
      ?.replace(/\.(md|svx)$/, "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<Post, "slug">;
      const post = v.parse(PostSchema, { ...metadata, slug });
      post.published && posts.push(post);
    }
  }

  posts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );
  return posts;
}

const router = new Hono()
  .use(logger())
  .use(secureHeaders())
  .onError((err, c) => {
    console.error(err);
    return c.json(
      { error: "Internal Server Error", details: err.message },
      500
    );
  })
  .get("/post", async (c) => {
    return c.json(await getPosts());
  })
  .get(
    "/post/:slug",
    vValidator(
      "param",
      v.object({
        slug: v.string(),
      })
    ),
    async (c) => {
      const { slug } = c.req.valid("param");
      const posts = await getPosts();
      const post = posts.find((post) => post.slug === slug);
      if (!post) {
        return c.json({ error: "Post not found" }, 404);
      }
      return c.json(post);
    }
  );

export const app = new Hono().route("/api", router);

export type App = typeof app;
