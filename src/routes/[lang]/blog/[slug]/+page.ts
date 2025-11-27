import { getBlogPost } from '$lib/blog';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const blogModules = import.meta.glob<{ default: typeof import('*.svelte') }>(
	'../../../../content/*/blog/*.md',
	{ eager: true }
);

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'jp';
	const slug = params.slug;

	const post = await getBlogPost(lang, slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	const contentPath = `../../../../content/${lang}/blog/${slug}.md`;
	const contentModule = blogModules[contentPath];

	if (!contentModule) {
		throw error(404, 'Content not found');
	}

	return {
		lang,
		slug,
		post,
		content: contentModule.default
	};
};

