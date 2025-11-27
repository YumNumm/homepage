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

          const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

          if (title) {
            return `<div class="code-block-wrapper">
              <div class="code-block-header">
                <div class="code-block-title">${escapeSvelte(title)}</div>
                <button class="code-block-copy" data-code-id="${codeId}" aria-label="Copy code">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              <div class="code-block-content" id="${codeId}">${html}</div>
            </div>`;
          }

          return `<div class="code-block-wrapper">
            <button class="code-block-copy" data-code-id="${codeId}" aria-label="Copy code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <div class="code-block-content" id="${codeId}">${html}</div>
          </div>`;
        },
      },
    }),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;
