import { escapeSvelte } from 'mdsvex';

export function createCodeBlockHtml(
	html: string,
	title: string | null
): string {
	const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

	if (title) {
		return `<div class="code-block-wrapper">
			<div class="code-block-header">
				<div class="code-block-title">${escapeSvelte(title)}</div>
				<button class="code-block-copy" data-code-id="${codeId}" aria-label="Copy code">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
					</svg>
				</button>
			</div>
			<div class="code-block-content" id="${codeId}">${html}</div>
		</div>`;
	}

	return `<div class="code-block-wrapper">
		<button class="code-block-copy" data-code-id="${codeId}" aria-label="Copy code">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
				<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
			</svg>
		</button>
		<div class="code-block-content" id="${codeId}">${html}</div>
	</div>`;
}

export function extractTitleFromMeta(meta: string | undefined): string | null {
	if (!meta) return null;
	const titleMatch = meta.match(/title="([^"]+)"/);
	return titleMatch ? titleMatch[1] : null;
}

