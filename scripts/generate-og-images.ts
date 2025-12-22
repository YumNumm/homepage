/**
 * OGP画像生成スクリプト
 * ビルド時に実行され、static/og/ に画像を生成します
 */

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import matter from "gray-matter";
import type { ReactNode } from "react";
import satori from "satori";

// サイトのダークテーマカラー
const colors = {
	background: "#0b192c",
	surface: "#0f0f1a",
	surfaceHover: "#1a1a2a",
	text: "#d0d1e7",
	textMuted: "#8b8d98",
	accent: "#8b9aff",
	border: "#34384b",
};

interface Post {
	title: string;
	slug: string;
	description?: string;
	date: string;
	tags: string[];
	published: boolean;
}

async function initializeWasm() {
	try {
		const wasmPath = resolve(
			process.cwd(),
			"node_modules/@resvg/resvg-wasm/index_bg.wasm",
		);
		const wasmBuffer = await readFile(wasmPath);
		await initWasm(wasmBuffer);
	} catch {
		// Already initialized
	}
}

async function fetchFont(url: string): Promise<ArrayBuffer> {
	const response = await fetch(url);
	return response.arrayBuffer();
}

// 再帰的にディレクトリを走査してファイルを取得
async function getFilesRecursively(
	dir: string,
	baseDir: string,
): Promise<{ filePath: string; slug: string }[]> {
	const entries = await readdir(dir);
	const results: { filePath: string; slug: string }[] = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry);
		const stats = await stat(fullPath);

		if (stats.isDirectory()) {
			// サブディレクトリを再帰的に走査
			const subResults = await getFilesRecursively(fullPath, baseDir);
			results.push(...subResults);
		} else if (entry.endsWith(".svx") || entry.endsWith(".md")) {
			// slugはbaseDirからの相対パス（拡張子なし）
			const relativePath = fullPath.replace(`${baseDir}/`, "");
			const slug = relativePath.replace(/\.(md|svx)$/, "");
			results.push({ filePath: fullPath, slug });
		}
	}

	return results;
}

async function getPosts(): Promise<Post[]> {
	const blogDir = resolve(process.cwd(), "src/content/blog");
	const files = await getFilesRecursively(blogDir, blogDir);
	const posts: Post[] = [];

	for (const { filePath, slug } of files) {
		const content = await readFile(filePath, "utf-8");
		const { data } = matter(content);

		const post: Post = {
			title: data.title,
			slug,
			description: data.description,
			date: data.date,
			tags: data.tags || [],
			published: data.published ?? false,
		};

		if (post.published) {
			posts.push(post);
		}
	}

	return posts;
}

async function getPostContent(slug: string): Promise<string> {
	const blogDir = resolve(process.cwd(), "src/content/blog");
	const filePath = join(blogDir, `${slug}.svx`);

	if (!existsSync(filePath)) {
		const mdPath = join(blogDir, `${slug}.md`);
		if (!existsSync(mdPath)) return "";
		const content = await readFile(mdPath, "utf-8");
		return processContent(content);
	}

	const content = await readFile(filePath, "utf-8");
	return processContent(content);
}

function processContent(content: string): string {
	// Frontmatterを除去
	const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, "");

	// コードブロックを除去
	const withoutCodeBlocks = withoutFrontmatter.replace(/```[\s\S]*?```/g, "");

	// Markdown記法を除去（簡易版）
	const withoutMarkdown = withoutCodeBlocks
		.replace(/#{1,6}\s+/g, "") // 見出し
		.replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
		.replace(/\*([^*]+)\*/g, "$1") // Italic
		.replace(/`([^`]+)`/g, "$1") // inline code
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // リンク
		.replace(/[>\-*+]/g, "") // リスト記号など
		.replace(/\n+/g, "") // 改行
		.trim();

	return withoutMarkdown;
}

function createPlusPattern(): ReactNode[] {
	const spacing = 80;
	const plusElements: ReactNode[] = [];
	for (let y = 0; y < 630; y += spacing) {
		for (let x = 20; x < 1300; x += spacing) {
			plusElements.push({
				type: "div",
				props: {
					key: `${x}-${y}`,
					style: {
						position: "absolute",
						left: x,
						top: y,
						display: "flex",
						fontSize: 45,
						color: colors.border,
						opacity: 0.5,
					},
					children: "+",
				},
			});
		}
	}
	return plusElements;
}

function createHomeElement(faviconBase64: string): ReactNode {
	const plusElements = createPlusPattern();

	return {
		type: "div",
		props: {
			style: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				backgroundColor: colors.background,
				fontFamily: "JetBrains Mono, Noto Sans JP",
				position: "relative",
			},
			children: [
				// +パターン背景
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
						},
						children: plusElements,
					},
				},
				// メインカード
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: colors.surface,
							borderRadius: 32,
							padding: "24px 48px",
							width: "85%",
							height: "80%",
							border: `1px solid ${colors.border}`,
							boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
						},
						children: [
							{
								type: "img",
								props: {
									src: faviconBase64,
									style: {
										width: 180,
										height: 180,
										borderRadius: "50%",
										border: `4px solid ${colors.border}`,
										marginBottom: 28,
									},
								},
							},
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										fontSize: 68,
										fontWeight: "bold",
										color: colors.text,
										letterSpacing: "-0.02em",
									},
									children: "もぐもぐのサイト",
								},
							},
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										fontSize: 35,
										color: colors.textMuted,
										marginTop: 8,
									},
									children: "@YumNumm",
								},
							},
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										fontSize: 28,
										color: colors.accent,
										marginTop: 16,
									},
									children: "https://yumnumm.dev",
								},
							},
						],
					},
				},
			],
		},
	};
}

function createBlogElement(
	post: Post,
	charCount: number,
	faviconBase64: string,
): ReactNode {
	const plusElements = createPlusPattern();
	const description = post.description || "";

	return {
		type: "div",
		props: {
			style: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				backgroundColor: colors.background,
				fontFamily: "JetBrains Mono, Noto Sans JP",
				position: "relative",
			},
			children: [
				// +パターン背景
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
						},
						children: plusElements,
					},
				},
				// メインカード
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							justifyContent: "space-between",
							backgroundColor: colors.surface,
							borderRadius: 32,
							padding: "40px 56px",
							width: "85%",
							height: "80%",
							border: `1px solid ${colors.border}`,
							boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
										width: "100%",
									},
									children: [
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													fontSize: 56,
													fontWeight: "bold",
													color: colors.text,
													lineHeight: 1.3,
													letterSpacing: "-0.02em",
													marginBottom: 20,
												},
												children: post.title,
											},
										},
										description
											? {
													type: "div",
													props: {
														style: {
															display: "flex",
															fontSize: 28,
															color: colors.textMuted,
															lineHeight: 1.6,
														},
														children:
															description.length > 80
																? `${description.slice(0, 80)}...`
																: description,
													},
												}
											: null,
									].filter(Boolean),
								},
							},
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										width: "100%",
									},
									children: [
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													alignItems: "center",
													gap: 16,
												},
												children: [
													{
														type: "img",
														props: {
															src: faviconBase64,
															style: {
																width: 56,
																height: 56,
																borderRadius: "50%",
																border: `2px solid ${colors.border}`,
															},
														},
													},
													{
														type: "div",
														props: {
															style: {
																display: "flex",
																fontSize: 28,
																color: colors.text,
																fontWeight: 500,
															},
															children: "もぐもぐ - @YumNumm",
														},
													},
												],
											},
										},
										charCount > 0
											? {
													type: "div",
													props: {
														style: {
															display: "flex",
															fontSize: 24,
															color: colors.textMuted,
														},
														children: `${charCount.toLocaleString()} 文字`,
													},
												}
											: null,
									].filter(Boolean),
								},
							},
						],
					},
				},
			],
		},
	};
}

async function renderToPng(
	element: ReactNode,
	fonts: { name: string; data: ArrayBuffer; weight: number; style: string }[],
): Promise<Buffer> {
	const svg = await satori(element, {
		width: 1200,
		height: 630,
		fonts,
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: "width",
			value: 1200,
		},
	});
	const pngData = resvg.render();
	return Buffer.from(pngData.asPng());
}

async function main() {
	console.log("🎨 OGP画像生成を開始します...");

	// WASmの初期化
	await initializeWasm();

	// フォントの読み込み
	console.log("📝 フォントを読み込み中...");
	const [jetbrainsMonoData, jetbrainsMonoBoldData, notoSansJpBoldData] =
		await Promise.all([
			fetchFont(
				"https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf",
			),
			fetchFont(
				"https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.ttf",
			),
			fetchFont(
				"https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf",
			),
		]);

	const fonts = [
		{
			name: "JetBrains Mono",
			data: jetbrainsMonoData,
			weight: 400,
			style: "normal",
		},
		{
			name: "JetBrains Mono",
			data: jetbrainsMonoBoldData,
			weight: 700,
			style: "normal",
		},
		{
			name: "Noto Sans JP",
			data: notoSansJpBoldData,
			weight: 700,
			style: "normal",
		},
	];

	// faviconの読み込み
	const faviconPath = resolve(process.cwd(), "static/favicon.jpg");
	const faviconBuffer = await readFile(faviconPath);
	const faviconBase64 = `data:image/jpeg;base64,${faviconBuffer.toString("base64")}`;

	// 出力ディレクトリの作成
	const outputDir = resolve(process.cwd(), "static/og");
	const blogOutputDir = resolve(outputDir, "blog");
	await mkdir(outputDir, { recursive: true });
	await mkdir(blogOutputDir, { recursive: true });

	// トップページ用OGP画像の生成
	console.log("🏠 トップページ用OGP画像を生成中...");
	const homeElement = createHomeElement(faviconBase64);
	const homePng = await renderToPng(homeElement, fonts);
	await writeFile(join(outputDir, "home.png"), homePng);
	console.log("  ✅ static/og/home.png");

	// ブログ記事用OGP画像の生成
	const posts = await getPosts();
	console.log(`📝 ${posts.length}件のブログ記事用OGP画像を生成中...`);

	for (const post of posts) {
		const content = await getPostContent(post.slug);
		const charCount = content.length;
		const blogElement = createBlogElement(post, charCount, faviconBase64);
		const blogPng = await renderToPng(blogElement, fonts);

		// 階層構造に対応したディレクトリ作成
		const outputPath = join(blogOutputDir, `${post.slug}.png`);
		await mkdir(dirname(outputPath), { recursive: true });
		await writeFile(outputPath, blogPng);
		console.log(`  ✅ static/og/blog/${post.slug}.png`);
	}

	console.log("🎉 OGP画像生成が完了しました！");
}

main().catch((error) => {
	console.error("❌ OGP画像生成中にエラーが発生しました:", error);
	process.exit(1);
});
