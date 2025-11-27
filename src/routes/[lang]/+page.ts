import type { PageLoad } from './$types';
import type { Component } from 'svelte';

const contentModules = import.meta.glob<{ default: Component }>('../../../content/*/index.md', {
	eager: true
});

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang;
	const contentPath = `../../../content/${lang}/index.md`;
	const contentModule = contentModules[contentPath];

	if (!contentModule) {
		throw new Error(`Content not found for language: ${lang}`);
	}

	return {
		lang,
		Content: contentModule.default
	};
};

