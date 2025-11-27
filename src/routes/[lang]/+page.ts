import type { PageLoad } from './$types';
import type { Component } from 'svelte';

const contentModules = import.meta.glob<{ default: Component }>('../../../../content/*/index.md', {
	eager: true
});

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang;
	
	// import.meta.globで取得されるパスを検索
	const found = Object.entries(contentModules).find(([path]) => {
		return path.includes(`/content/${lang}/index.md`);
	});

	if (!found) {
		throw new Error(`Content not found for language: ${lang}`);
	}

	const [, contentModule] = found;

	return {
		lang,
		Content: contentModule.default
	};
};
