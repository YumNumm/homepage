import { app, makeClient } from "../api/[...paths]/app";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const client = makeClient(fetch);
  const posts = await client.post.$get();

  return {
    posts,
  };
};
