import { getBlogPost } from '$lib/blog';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';

const blogModules = import.meta.glob<{ default: Component }>('../../../content/*/blog/*.md', {
	eager: true
});

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'jp';
	const slug = params.slug;

	const post = await getBlogPost(lang, slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	const found = Object.entries(blogModules).find(([path]) => {
		return path.includes(`content/${lang}/blog/${slug}.md`);
	});

	if (!found) {
		throw error(404, 'Content not found');
	}

	const [, contentModule] = found;

	return {
		lang,
		slug,
		post,
		Content: contentModule.default
	};
};
