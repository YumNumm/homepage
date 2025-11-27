import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md", ".svx"],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".svx"],
      layout: {
        blog: "./src/routes/[lang]/blog/[slug]/+page.svelte",
        _: "./src/routes/[lang]/+page.svelte",
      },
			smartypants: {
				dashes: "oldschool",
			}
    }),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;
