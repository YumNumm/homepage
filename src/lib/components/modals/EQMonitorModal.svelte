<div class="modal-detail-content">
	<h3>概要</h3>
	<p>
		EQMonitorは、日本国内の地震情報をリアルタイムで通知・表示するFlutter製のモバイルアプリケーションです。
		緊急地震速報、震度速報、各地の震度情報、津波警報などをプッシュ通知でお届けします。
	</p>

	<img src="https://private-user-images.githubusercontent.com/73390859/340797495-4196623d-222e-4eac-991a-fee5a976be76.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjQyNzEzNTYsIm5iZiI6MTc2NDI3MTA1NiwicGF0aCI6Ii83MzM5MDg1OS8zNDA3OTc0OTUtNDE5NjYyM2QtMjIyZS00ZWFjLTk5MWEtZmVlNWE5NzZiZTc2LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTExMjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMTI3VDE5MTczNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTg1ODRhMDM0NTY2NzY1NTI0Y2Q3MzUwMjYwOThlYjNjYzJhZjQxYzFjZTZmZjdjNzY4NGE2YzI3NTk2MTdlNjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.ZuMB8KbRbkXvQmx_eNqZ4eJsvCpq5JE7093dhjfkky4" alt="EQMonitor Screenshot" />


	<h3>主な機能</h3>
	<ul>
		<li><strong>リアルタイム地震情報</strong>: 気象庁発表の地震情報をリアルタイムで取得・表示</li>
		<li><strong>緊急地震速報</strong>: 緊急地震速報（警報・予報）をプッシュ通知でお届け</li>
		<li><strong>震度マップ</strong>: 各地の震度情報を地図上にビジュアライズ</li>
		<li><strong>履歴機能</strong>: 過去の地震情報を閲覧可能</li>
	</ul>

	<h3>技術スタック</h3>
	<ul>
		<li><strong>フロントエンド</strong>: Flutter (Dart)</li>
		<li><strong>バックエンド</strong>: Cloudflare Workers, D1, Supabase Cloud</li>
		<li><strong>インフラ</strong>: 自宅サーバー (LXD), Terraform, Oracle Cloud</li>
		<li><strong>CI/CD</strong>: GitHub Actions</li>
	</ul>

	<h3>開発の背景</h3>
	<p>
		日本は地震大国であり、地震情報を素早く正確に把握することは非常に重要です。
		既存の地震情報アプリに満足できず、自分が本当に使いたいと思えるアプリを作りたいという思いから開発を始めました。
	</p>
	<p>
		個人開発でありながら、MAU1万を超え、多くのユーザーに利用いただいています。
	</p>


<div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;">
  <a href="https://play.google.com/store/apps/details?id=net.yumnumm.eqmonitor">
    <img src="https://github.com/YumNumm/YumNumm/raw/main/resources/img/google-play-badge.png" style="height: 40px; width: auto;" alt="Get it on Google Play" />
  </a>
  <a href="https://apps.apple.com/ja/app/eqmonitor-%E5%9C%B0%E9%9C%87%E9%80%9F%E5%A0%B1/id6447546703">
    <img src="https://github.com/YumNumm/YumNumm/raw/main/resources/img/appstore-badge.png" style="height: 40px; width: auto;" alt="Download on the App Store" />
  </a>
</div>


	<div class="links">
		<a href="https://eqmonitor.app" target="_blank" rel="noopener noreferrer" class="link-button">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="2" y1="12" x2="22" y2="12"></line>
				<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
			</svg>
			公式サイト
		</a>
		<a href="https://github.com/YumNumm/EQMonitor" target="_blank" rel="noopener noreferrer" class="link-button">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
			</svg>
			GitHub
		</a>
	</div>
</div>

<style>
	.modal-detail-content {
		line-height: 1.8;
	}

	.modal-detail-content h3 {
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-size: 1.25rem;
		color: var(--color-text);
		padding-left: 0;
	}

	.modal-detail-content h3:first-child {
		margin-top: 0;
	}

	.modal-detail-content h3::before {
		content: none;
	}

	.modal-detail-content p {
		margin-bottom: 1rem;
		color: var(--color-text);
	}

	.modal-detail-content ul {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.modal-detail-content li {
		margin-bottom: 0.5rem;
	}

	.links {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}

	.link-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: var(--color-accent);
		color: white;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.link-button:hover {
		background: var(--color-accent-dark);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(42, 55, 244, 0.3);
		text-decoration: none;
		color: white;
	}

	:global([data-theme='dark']) .link-button,
	:global([data-radix-theme='dark']) .link-button {
		background: #4c5aff;
	}

	:global([data-theme='dark']) .link-button:hover,
	:global([data-radix-theme='dark']) .link-button:hover {
		background: #6b77ff;
	}
</style>
