import { getClient } from "$lib/api/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const client = getClient();
  const response = await client.api.post.$get();
  const posts = await response.json();

  return {
    posts: posts.data,
  };
};
