import type { PageLoad } from './$types';
import type { Component } from 'svelte';

// mdsvexで処理された.svxと.mdファイルを読み込む
const contentModules = import.meta.glob<{ default: Component }>(
	'../../content/*/index.{md,svx}',
	{
		eager: true
	}
);

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang;

	// import.meta.globで取得されるパスを検索
	const found = Object.entries(contentModules).find(([path]) => {
		// パスに言語コードとindex.mdまたはindex.svxが含まれているか確認
		return (
			path.includes(`content/${lang}/index.md`) ||
			path.includes(`content/${lang}/index.svx`) ||
			path.includes(`content\\${lang}\\index.md`) ||
			path.includes(`content\\${lang}\\index.svx`)
		);
	});

	if (!found) {
		const availablePaths = Object.keys(contentModules);
		console.error(`Content not found for language: ${lang}`);
		console.error('Available paths:', availablePaths);
		throw new Error(`Content not found for language: ${lang}`);
	}

	const [, contentModule] = found;

	return {
		lang,
		Content: contentModule.default
	};
};
