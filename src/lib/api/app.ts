import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { hc } from "hono/client";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import * as v from "valibot";
import type { Post } from "./models/post";
import { PostSchema } from "./models/post";

async function getPosts(): Promise<Post[]> {
	const paths = import.meta.glob("/src/content/blog/**/*", { eager: true });
	const posts = [];
	for (const path in paths) {
		const file = paths[path];
		// /src/content/blog/ からの相対パスをslugとして使用（階層構造に対応）
		const slug = path
			.replace("/src/content/blog/", "")
			.replace(/\.(md|svx)$/, "");
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
	// 階層構造に対応したファイル検索
	const post =
		paths[`/src/content/blog/${slug}.svx`] ||
		paths[`/src/content/blog/${slug}.md`];
	console.log(post);
	return post as Post;
}

export type HonoBindings = App.Platform["env"] & Cloudflare.Env;

const router = new Hono<{
	Bindings: HonoBindings;
}>()
	.use(logger())
	.use(secureHeaders())
	.use(
		cache({
			cacheName: "api",
			cacheControl: "max-age=60",
		}),
	)
	.onError((err, c) => {
		console.error(err);
		return c.json(
			{ error: "Internal Server Error", details: err.message },
			500,
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
			}),
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
		},
	);

export const app = new Hono().route("/api", router);

export type App = typeof app;

export type Client = ReturnType<typeof hc<typeof app>>;
export const hcWithType = (...args: Parameters<typeof hc>): Client =>
	hc<typeof app>(...args);
