import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, escapeSvelte } from "mdsvex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePresetMinify from "rehype-preset-minify";
import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
  themes: ["github-dark-high-contrast"],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md", ".svx"],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".svx", ".md"],
      smartypants: {
        dashes: "oldschool",
      },
      remarkPlugins: [],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            className: ["heading-anchor"],
          },
        ],
        rehypePresetMinify,
      ],
      highlight: {
        highlighter: async (code, lang = "text") => {
          const html = escapeSvelte(highlighter.codeToHtml(code, lang));
          return `{@html ${html}}`;
        },
      },
    }),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;
