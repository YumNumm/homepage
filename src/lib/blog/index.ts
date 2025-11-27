import matter from 'gray-matter';

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	lang: 'en' | 'jp';
	content: string;
}

const allBlogModules = import.meta.glob<{ default: string }>('../../../../content/*/blog/*.md', {
	eager: true
});

export async function getBlogPosts(lang: 'en' | 'jp'): Promise<BlogPost[]> {
	const posts: BlogPost[] = [];

	for (const [path, module] of Object.entries(allBlogModules)) {
		const pathParts = path.split('/');
		const postLang = pathParts[pathParts.length - 3] as 'en' | 'jp';

		if (postLang !== lang) continue;

		const slug = pathParts[pathParts.length - 1]?.replace('.md', '') || '';
		const { data, content } = matter(module.default);

		posts.push({
			slug,
			title: data.title || slug,
			date: data.date || '',
			lang: postLang,
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
	const found = Object.entries(allBlogModules).find(([path]) => {
		return path.includes(`/content/${lang}/blog/${slug}.md`);
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
		lang,
		content
	};
}
