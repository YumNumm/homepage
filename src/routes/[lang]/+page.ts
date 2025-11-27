import type { PageLoad } from './$types';

const contentModules = import.meta.glob<{ default: typeof import('*.svelte') }>(
	'../../../content/*/index.md',
	{ eager: true }
);

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang;
	const contentPath = `../../../content/${lang}/index.md`;
	const contentModule = contentModules[contentPath];

	if (!contentModule) {
		throw new Error(`Content not found for language: ${lang}`);
	}

	return {
		lang,
		content: contentModule.default
	};
};

