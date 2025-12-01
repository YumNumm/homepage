import * as v from "valibot";

export const PostSchema = v.object({
	title: v.string(),
	slug: v.string(),
	description: v.optional(v.string()),
	date: v.string(),
	tags: v.array(v.string()),
	published: v.optional(v.boolean(), false),
});

export type Post = v.InferOutput<typeof PostSchema>;
