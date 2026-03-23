import type { Post } from "$lib/api/models/post";

export const metadata: Omit<Post, "slug"> = {
	title: "2025年を振り返る (エンジニア編)",
	date: "2026-01-17",
	tags: ["仕事", "エンジニア"],
	published: false,
};

export default function Review2025EngineerPost() {
	return (
		<>
			<h2>導入</h2>
			<p>こんにちは。</p>
			<p>もうあっという間に2026年になってしまいましたね。</p>
			<p>今更ですが、2025年の活動を振り返っていこうと思います。</p>

			<h2>ソフトウェアエンジニアとしての活動</h2>
			<p>2025年も、たくさんコードを書いてたくさん開発をしてきました。</p>

			<h3>仕事</h3>
			<h3>FlutterKaigi 2025</h3>
			<h3>登壇</h3>
			<h3>個人開発</h3>

			<h2>プライベート</h2>
			<h3>引っ越し失敗....</h3>
			<p>本当にバカでびっくりなのですが、2025年は3回引っ越しました。。。</p>

			<h3>カメラ買った</h3>

			<h2>まとめと2026年の展望</h2>
		</>
	);
}
