import { Hono } from "hono";
import type { Post } from "./models/post";
import * as v from "valibot";
import { PostSchema } from "./models/post";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { vValidator } from "@hono/valibot-validator";
import { cache } from "hono/cache";
import { hc } from "hono/client";

async function getPosts(): Promise<Post[]> {
  const paths = import.meta.glob("/src/content/blog/**/*", { eager: true });
  const posts = [];
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
  return posts;
}

async function getPost(slug: string): Promise<Post> {
  const paths = import.meta.glob("/src/content/blog/**/*", { eager: true });
  const post = paths[`/src/content/blog/${slug}.svx`];
  console.log(post);
  return post as Post;
}

export type HonoBindings = Partial<
  App.Platform["env"] & { caches: App.Platform["caches"] }
>;

const router = new Hono<{
  Bindings: HonoBindings;
}>()
  .use(logger())
  .use(secureHeaders())
  .use(
    cache({
      cacheName: "api",
      cacheControl: "max-age=60",
    })
  )
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
      const content = await getPost(slug);
      return c.json({ ...post, Content: content });
    }
  );

export const app = new Hono().route("/api", router);

export type App = typeof app;

export type Client = ReturnType<typeof hc<typeof app>>;
export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args);
