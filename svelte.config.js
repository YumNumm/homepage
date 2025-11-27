import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, escapeSvelte } from "mdsvex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePresetMinify from "rehype-preset-minify";
import { createHighlighter } from "shiki";
import { transformerTwoslash, rendererRich } from "@shikijs/twoslash";

const highlighter = await createHighlighter({
  themes: ["github-dark-high-contrast"],
  langs: ["ts", "dart"],
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
        highlighter: async (code, lang = "text", meta) => {
          // metaからtitleを抽出
          const titleMatch = meta?.match(/title="([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : null;

          const html = escapeSvelte(
            highlighter.codeToHtml(code, {
              lang,
              theme: "github-dark-high-contrast",
              transformers: [
                transformerTwoslash({
                  renderer: rendererRich(),
                }),
                transformerColorizedBrackets(),
              ],
            })
          );

          if (title) {
            return `<div class="code-block-wrapper">
              <div class="code-block-title">${escapeSvelte(title)}</div>
              ${html}
            </div>`;
          }

          return html;
        },
      },
    }),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;
