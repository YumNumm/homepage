import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { escapeSvelte, mdsvex } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeSlug from "rehype-slug";
import { createHighlighter } from "shiki";
import {
	createCodeBlockHtml,
	extractTitleFromMeta,
} from "./src/lib/utils/code-block.ts";

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
					const title = extractTitleFromMeta(meta);

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
						}),
					);

					return createCodeBlockHtml(html, title);
				},
			},
		}),
	],

	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: "ignore",
		},
	},
};

export default config;
