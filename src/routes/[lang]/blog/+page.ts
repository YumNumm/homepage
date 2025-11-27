import { getBlogPosts } from '$lib/blog';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang as 'en' | 'jp';
	const posts = await getBlogPosts(lang);

	return {
		lang,
		posts
	};
};

