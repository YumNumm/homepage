import type { PageLoad } from './$types';
import type { Component } from 'svelte';

// mdsvexで処理された.svxと.mdファイルを読み込む
const contentModules = import.meta.glob<{ default: Component }>(
	'../content/jp/index.{md,svx}',
	{
		eager: true
	}
);

export const load: PageLoad = async () => {
	const found = Object.entries(contentModules).find(([path]) => {
		return (
			path.includes('content/jp/index.md') ||
			path.includes('content/jp/index.svx') ||
			path.includes('content\\jp\\index.md') ||
			path.includes('content\\jp\\index.svx')
		);
	});

	if (!found) {
		const availablePaths = Object.keys(contentModules);
		console.error('Content not found');
		console.error('Available paths:', availablePaths);
		throw new Error('Content not found');
	}

	const [, contentModule] = found;

	return {
		Content: contentModule.default
	};
};

