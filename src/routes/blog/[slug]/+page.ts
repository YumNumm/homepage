import { getBlogPost } from '$lib/blog';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';

const blogModules = import.meta.glob<{ default: Component }>('../../../content/jp/blog/*.md', {
	eager: true
});

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;

	const post = await getBlogPost('jp', slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	const found = Object.entries(blogModules).find(([path]) => {
		return path.includes(`content/jp/blog/${slug}.md`);
	});

	if (!found) {
		throw error(404, 'Content not found');
	}

	const [, contentModule] = found;

	return {
		slug,
		post,
		Content: contentModule.default
	};
};

