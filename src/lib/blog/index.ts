import matter from 'gray-matter';

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	lang: 'en' | 'jp';
	content: string;
}

export async function getBlogPosts(lang: 'en' | 'jp'): Promise<BlogPost[]> {
	const modules = import.meta.glob<{ default: string }>(
		`../../../content/${lang}/blog/*.md`,
		{ eager: true }
	);

	const posts: BlogPost[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const slug = path.split('/').pop()?.replace('.md', '') || '';
		const { data, content } = matter(module.default);

		posts.push({
			slug,
			title: data.title || slug,
			date: data.date || '',
			lang,
			content
		});
	}

	return posts.sort((a, b) => {
		if (!a.date || !b.date) return 0;
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
}

export async function getBlogPost(
	lang: 'en' | 'jp',
	slug: string
): Promise<BlogPost | null> {
	const modules = import.meta.glob<{ default: string }>(
		`../../../content/${lang}/blog/*.md`,
		{ eager: true }
	);

	const path = `../../../content/${lang}/blog/${slug}.md`;
	const module = modules[path];

	if (!module) {
		return null;
	}

	const { data, content } = matter(module.default);

	return {
		slug,
		title: data.title || slug,
		date: data.date || '',
		lang,
		content
	};
}

