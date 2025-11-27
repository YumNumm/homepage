import { app, type App } from "../../../lib/api/app";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Component } from "svelte";
import { hc } from "hono/client";

export const load: PageLoad = async ({ params, fetch }) => {
  const slug = params.slug;

  if (!slug) {
    throw error(404, "Post not found");
  }

  const client = hc<App>("/", { fetch });
  const response = await client.api.post[`:${slug}`].$get({ param: { slug } });

  if (!response.ok) {
    throw error(404, "Post not found");
  }

  const post = await response.json();
  return {
    post,
  };
};
