import { getRouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import { DetailModal } from "$lib/components/DetailModal";
import { EQMonitorModal } from "$lib/components/modals/EQMonitorModal";

const homeRoute = getRouteApi("/");

const detailContents = {
	eqmonitor: {
		title: "EQMonitor - 地震速報アプリ",
	},
} as const;

type DetailKey = keyof typeof detailContents;

function isDetailKey(d: string | undefined): d is DetailKey {
	return d === "eqmonitor";
}

export function HomePage() {
	const { detail } = homeRoute.useSearch();
	const navigate = homeRoute.useNavigate();

	const birthDate = useMemo(() => new Date(2004, 8, 17), []);
	const age = useMemo(() => {
		const today = new Date();
		let a = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			a--;
		}
		return a;
	}, [birthDate]);

	const openModal = (key: string) => {
		void navigate({ search: { detail: key } });
	};

	const closeModal = () => {
		void navigate({ search: { detail: undefined } });
	};

	return (
		<>
			<div className="profile-page">
				<h1>
					<div id="name">
						<img
							src="/favicon.jpg"
							alt="favicon"
							style={{ width: "2em", height: "2em", borderRadius: "50%" }}
						/>
						Ryotaro Onoue
					</div>
				</h1>

				<div className="profile-info">
					<p>
						尾上 遼太朗 (おのうえ りょうたろう, aka. <strong>もぐもぐ</strong>)
					</p>
					<p>2004年9月17日生まれ ({age}歳)</p>
					<p>
						<a href="mailto:admin@yumnumm.dev">Mail</a>・
						<a href="https://github.com/yumnumm">GitHub</a>・
						<a href="https://linkedin.com/in/yumnumm">LinkedIn</a>・
						<a href="https://x.com/yumnumm">X</a>
					</p>
				</div>

				<br />

				<hr />

				<h2>Skills</h2>
				<ul>
					<li>
						Mobile App
						<ul>
							<li>Flutter</li>
							<li>Dart</li>
						</ul>
					</li>
					<li>
						Server
						<ul>
							<li>TypeScript</li>
						</ul>
					</li>
					<li>
						Infrastructure
						<ul>
							<li>Terraform</li>
							<li>Docker</li>
							<li>
								Cloudflare
								<ul>
									<li>Cloudflare Workers</li>
									<li>Cloudflare Durable Objects</li>
									<li>Cloudflare KV/R2/D1</li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>

				<hr />

				<h2>Experience</h2>
				<h3>2023.4 ~ 2025.11: YUMEMI Inc.</h3>
				<ul>
					<li>
						Flutterエンジニアとして、2023年4月に新卒入社。
						Flutterマイスターエンジニアとして従事。
					</li>
				</ul>
				<h3>2025.12- Accenture Japan Ltd</h3>
				<ul>
					<li>2025.12 ~: Product Enginner Accosiate Manager</li>
				</ul>

				<hr />

				<h2>Education</h2>
				<h3>2020.4 ~ 2023.3: 横浜市立横浜サイエンスフロンティア高等学校</h3>

				<hr />

				<h2>Projects</h2>
				<h3 className="project-title-row">
					<img
						src="/EQMonitor_icon.webp"
						alt="EQMonitor Icon"
						width={50}
						height={50}
					/>
					<strong>EQMonitor</strong>
				</h3>
				<p>地震速報アプリケーション</p>
				<button
					type="button"
					className="detail-button"
					onClick={() => openModal("eqmonitor")}
				>
					<span>詳しく見る</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<title>詳しく見る</title>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>

				<hr />

				<h2>Hobbies &amp; Private Activities</h2>
				<h3>🖥️ 自宅サーバ・ネットワーク</h3>
				<p>
					VPS代に嫌気が差して、自宅ラックサーバを購入。FUJITSU RX2530 M4
					(40C80T, 128GB RAM)
					を中心に、LXDコンテナ仮想化でホームラボを構築。Grafana/Prometheus/OpenTelemetryベースの監視基盤も運用中。
				</p>

				<h3>📷 カメラ</h3>
				<p>
					SONY α7C
					IIを購入し、写真・動画撮影を楽しんでいます。スマホでは撮れないボケ感と解像度に感動。旅行やイベントの思い出をキレイに残すことを目指しています。
				</p>

				<hr />

				<h2>Speaking Engagements</h2>
				<SpeakingTables />
			</div>

			{isDetailKey(detail) ? (
				<DetailModal
					isOpen
					onClose={closeModal}
					title={detailContents[detail].title}
					icon={detail === "eqmonitor" ? "/EQMonitor_icon.webp" : undefined}
				>
					{detail === "eqmonitor" ? <EQMonitorModal /> : null}
				</DetailModal>
			) : null}
		</>
	);
}

function SpeakingTables() {
	return (
		<div className="speaking-engagements-tables">
			<h3>2025</h3>
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Title</th>
							<th>Event</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>2025.11.16</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/flutterkaigi-2025-gong-shi-apuri-and-websaitonocdnituite"
									target="_blank"
									rel="noopener noreferrer"
								>
									FlutterKaigi 2025 公式アプリ&amp;WebサイトのCDについて
								</a>
							</td>
							<td>Flutter ZY</td>
						</tr>
						<tr>
							<td>2025.11.12</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/flutterkaigi-2025-sisutemuli-ce"
									target="_blank"
									rel="noopener noreferrer"
								>
									FlutterKaigi 2025 システムの裏側
								</a>
							</td>
							<td>FlutterKaigi 2025 前夜祭</td>
						</tr>
						<tr>
							<td>2025.06.20</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/terraform-plus-cloud-initdezi-zhai-sabanolxdwoiacsuruohua"
									target="_blank"
									rel="noopener noreferrer"
								>
									Terraform+cloud-initで自宅サーバのLXDをIaCするお話
								</a>
							</td>
							<td>ゆるく自動化を学ぶ会</td>
						</tr>
						<tr>
							<td>2025.04.26</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/flutterkaigi-2024niokerukai-fa-timunoqu-rizu-mi-to-2025henozhan-wang"
									target="_blank"
									rel="noopener noreferrer"
								>
									FlutterKaigi 2024における開発チームの取り組み と 2025への展望
								</a>
							</td>
							<td>FlutterKaigi mini #4 @Kyoto</td>
						</tr>
						<tr>
							<td>2025.04.06</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/dart-webassemblywoshi-tutaweb-api-on-cloudflare-workers-688dba71-50f5-46c4-bddd-14c474790e7c"
									target="_blank"
									rel="noopener noreferrer"
								>
									Dart WebAssemblyを使ったWeb API on Cloudflare Workers
								</a>
							</td>
							<td>Flutter Tokyo #6</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h3>2024</h3>
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Title</th>
							<th>Event</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>2024.07.12</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/apple-walletdepasuwozuo-ruohua"
									target="_blank"
									rel="noopener noreferrer"
								>
									Apple Walletでパスを作るお話
								</a>
							</td>
							<td>Money Forward×YUMEMI.grow 自称若手モバイルエンジニアLT会</td>
						</tr>
						<tr>
							<td>2024.05.21</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/si-gayatutekitaautopututoji"
									target="_blank"
									rel="noopener noreferrer"
								>
									私がやってきたアウトプット集
								</a>
							</td>
							<td>アウトプットとインプットを継続する秘訣LT会</td>
						</tr>
						<tr>
							<td>2024.05.16</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/si-nokodawaridesukuda-da-da-zi-man-ltda-hui-ltfes-number-12"
									target="_blank"
									rel="noopener noreferrer"
								>
									俺/私のこだわりデスク大大大自慢LT大会
								</a>
							</td>
							<td>LTFes #12 俺/私のこだわりデスク大大大自慢LT大会</td>
						</tr>
						<tr>
							<td>2024.05.13</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/shi-shi-yi-wai-dezuo-cheng-sitapurodakutonozi-man-da-hui"
									target="_blank"
									rel="noopener noreferrer"
								>
									EQMonitorのご紹介
								</a>
							</td>
							<td>LTFes #6 仕事以外で作成したプロダクトの自慢大会</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h3>2023</h3>
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Title</th>
							<th>Event</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>2023.12.19</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/cloudflare-workers-depurintosiruji-nohua-xiang-gong-you-sisutemuwozhi-zuo-sitaohua-at-serverlessf"
									target="_blank"
									rel="noopener noreferrer"
								>
									Cloudflare Workers
									でプリントシール機の画像共有システムを制作したお話
									@serverlessF
								</a>
							</td>
							<td>Serverless Frontend Meetup #4</td>
						</tr>
						<tr>
							<td>2023.12.09</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/flutter-x-jetpack-composenoxiang-hu-yun-yong-at-gdg-tokyo-2023"
									target="_blank"
									rel="noopener noreferrer"
								>
									Flutter×Jetpack Compose相互運用
								</a>
							</td>
							<td>GDG Tokyo</td>
						</tr>
						<tr>
							<td>2023.11.10</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/dartniyorubffgou-zhu-yun-yong-dart-frog-x-melos"
									target="_blank"
									rel="noopener noreferrer"
								>
									DartによるBFF構築・運用〜Dart From × Melos〜 (共同登壇)
								</a>
							</td>
							<td>FlutterKaigi 2023</td>
						</tr>
						<tr>
							<td>2023.09.29</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/flutterdemosiriarukonsorutong-xin-dekirumon"
									target="_blank"
									rel="noopener noreferrer"
								>
									Flutterでもシリアルコンソール通信できるもん!
								</a>
							</td>
							<td>YOUTRUST × ゆめみ Flutter LT #3</td>
						</tr>
						<tr>
							<td>2023.07.24</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/flutterdemodi-tu-womiao-kitaiohua"
									target="_blank"
									rel="noopener noreferrer"
								>
									Flutterでも地図を描きたいお話
								</a>
							</td>
							<td>YOUTRUST × ゆめみ Flutter LT #2</td>
						</tr>
						<tr>
							<td>2023.05.18</td>
							<td>
								<a
									href="https://speakerdeck.com/yumnumm/flutterxresitopurintadeyou-bu"
									target="_blank"
									rel="noopener noreferrer"
								>
									Flutter×レシートプリンターで遊ぶ
								</a>
							</td>
							<td>
								アットウェア x 未来シェア x ゆめみ 合同LT会 in 横浜 #yumemi_grow
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
