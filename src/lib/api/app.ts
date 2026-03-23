import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { hc } from "hono/client";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import * as v from "valibot";
import {
	collectPublishedPosts,
	getAllPostModules,
} from "$lib/posts/collectPosts";
import type { Post } from "./models/post";

async function getPosts(): Promise<Post[]> {
	const paths = getAllPostModules();
	return collectPublishedPosts(paths);
}

export type HonoBindings = Cloudflare.Env;

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
			const post = posts.find((p) => p.slug === slug);
			if (!post) {
				return c.json({ error: "Post not found" }, 404);
			}
			return c.json(post);
		},
	);

export const app = new Hono().route("/api", router);

export type App = typeof app;

export type Client = ReturnType<typeof hc<typeof app>>;
export const hcWithType = (...args: Parameters<typeof hc>): Client =>
	hc<typeof app>(...args);
