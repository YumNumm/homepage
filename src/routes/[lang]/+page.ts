import type { PageLoad } from './$types';
import type { Component } from 'svelte';

// import.meta.globはsrcディレクトリからの相対パスを使用
const contentModules = import.meta.glob<{ default: Component }>('../../content/*/index.md', {
	eager: true
});

export const load: PageLoad = async ({ params }) => {
	const lang = params.lang;

	// import.meta.globで取得されるパスを検索
	const found = Object.entries(contentModules).find(([path]) => {
		// パスに言語コードとindex.mdが含まれているか確認
		return path.includes(`content/${lang}/index.md`) || path.includes(`content\\${lang}\\index.md`);
	});

	if (!found) {
		// デバッグ用: 利用可能なパスをログ出力
		const availablePaths = Object.keys(contentModules);
		console.error(`Content not found for language: ${lang}`);
		console.error('Available paths:', availablePaths);
		// 404エラーを返す
		throw new Error(`Content not found for language: ${lang}`);
	}

	const [, contentModule] = found;

	return {
		lang,
		Content: contentModule.default
	};
};
