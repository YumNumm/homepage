import matter from 'gray-matter';

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	content: string;
}

const allBlogModules = import.meta.glob<{ default: string }>('../content/blog/*.md', {
	eager: true
});

export async function getBlogPosts(): Promise<BlogPost[]> {
	const posts: BlogPost[] = [];

	for (const [path, module] of Object.entries(allBlogModules)) {
		const slug = path.split('/').pop()?.replace('.md', '') || '';
		const { data, content } = matter(module.default);

		posts.push({
			slug,
			title: data.title || slug,
			date: data.date || '',
			content
		});
	}

	return posts.sort((a, b) => {
		if (!a.date || !b.date) return 0;
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
	const found = Object.entries(allBlogModules).find(([path]) => {
		return path.includes(`content/blog/${slug}.md`);
	});

	if (!found) {
		return null;
	}

	const [, module] = found;

	const { data, content } = matter(module.default);

	return {
		slug,
		title: data.title || slug,
		date: data.date || '',
		content
	};
}
