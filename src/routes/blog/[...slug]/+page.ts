import { makeClient } from '../../api/[...paths]/app';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';

const blogModules = import.meta.glob<{ default: Component }>('../../../content/blog/*.svx', {
	eager: true
});

export const load: PageLoad = async ({ params, fetch }) => {
	const slug = params.slug;
	
	if (!slug) {
		throw error(404, 'Post not found');
	}

	const client = makeClient(fetch);
	const response = await client.api.post[`:${slug}`].$get({ param: { slug } });
	
	if (!response.ok) {
		throw error(404, 'Post not found');
	}

	const post = await response.json();

	const found = Object.entries(blogModules).find(([path]) => {
		return path.includes(`content/blog/${slug}.svx`);
	});

	if (!found) {
		throw error(404, 'Content not found');
	}

	const [, contentModule] = found;

	return {
		post,
		Content: contentModule.default
	};
};
