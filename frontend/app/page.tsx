//- background.jpgを背景に、SignInUpコンポーネントを中央に配置
//- グラスモーフィズムなデザインでプレミアム感を演出
//ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止、またexport function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上のルールは保持し以降に内容を実装して

import React from 'react';
import Link from 'next/link';
import {
	Camera,
	Cpu,
	Mic2,
	BarChart3,
	ShieldCheck,
	Wifi,
	Clock,
	Search,
	Menu,
	ChevronRight,
	Smartphone,
	Settings,
	HelpCircle,
	Users
} from 'lucide-react';

/**
 * ナビゲーションバー
 * ページの最上部に固定され、各セクションへの導線を提供します。
 */
function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-default/80 backdrop-blur-xl">
			<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-10">
					<Link href="/" className="text-2xl font-black tracking-tighter text-white">
						AI <span className="text-primary-main">MAMA</span>
					</Link>
					<nav className="hidden items-center gap-8 md:flex">
						<Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">サービス紹介</Link>
						<Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">活用事例</Link>
						<Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">よくある質問</Link>
					</nav>
				</div>
				<div className="flex items-center gap-4">
					<Link href="/signin" className="hidden text-sm font-bold text-white transition-colors hover:text-primary-main sm:block">ログイン</Link>
					<Link
						href="/signin"
						className="rounded-full bg-primary-main px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
					>
						無料で始める
					</Link>
					<button className="text-white md:hidden">
						<Menu className="h-6 w-6" />
					</button>
				</div>
			</div>
		</header>
	);
}

/**
 * パンくずリスト
 * 現在のページ位置をユーザーに示します。
 */
function Breadcrumb() {
	return (
		<nav className="mx-auto max-w-7xl px-6 py-6 overflow-x-auto whitespace-nowrap">
			<ol className="flex items-center gap-2 text-xs font-medium text-white/40">
				<li><Link href="/" className="hover:text-white transition-colors">HOME</Link></li>
				<li><ChevronRight className="h-3 w-3" /></li>
				<li className="text-white/80">サービス・設備紹介</li>
			</ol>
		</nav>
	);
}

/**
 * セクションヘッダー
 * 各カテゴリーの導入部分に使用します。
 */
function SectionTitle(props: { title: string; subtitle?: string }) {
	return (
		<div className="mb-12 border-l-4 border-primary-main pl-6">
			<h2 className="text-3xl font-black text-white sm:text-4xl">{props.title}</h2>
			{props.subtitle && <p className="mt-2 text-lg text-white/50">{props.subtitle}</p>}
		</div>
	);
}

/**
 * 機能・設備カード（ZXYスタイル）
 * 画像、タグ、タイトル、詳細文を組み合わせたカード。
 */
function FeatureItem(props: {
	title: string;
	tags: string[];
	description: string;
	image?: string;
	icon?: React.ReactNode;
}) {
	return (
		<div className="group rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.05] hover:shadow-2xl">
			<div className="flex flex-col gap-8 lg:flex-row lg:items-center">
				{/* ビジュアルエリア */}
				<div className="shrink-0">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-primary-main transition-transform group-hover:scale-110 lg:h-24 lg:w-24">
						{props.icon || <Camera className="h-8 w-8 lg:h-12 lg:w-12" />}
					</div>
				</div>

				{/* テキストエリア */}
				<div className="flex-1">
					<div className="mb-3 flex flex-wrap gap-2">
						{props.tags.map(function (tag: string, i: number) {
							return (
								<span key={i} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
									{tag}
								</span>
							);
						})}
					</div>
					<h3 className="mb-4 text-2xl font-bold text-white">{props.title}</h3>
					<p className="max-w-3xl leading-relaxed text-white/60">{props.description}</p>
				</div>
			</div>
		</div>
	);
}

/**
 * グリッド形式の設備紹介
 */
function FacilityGridItem(props: { title: string; description: string; icon: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-5 p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-colors">
			<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-primary-main">
				{props.icon}
			</div>
			<div>
				<h4 className="mb-2 font-bold text-white">{props.title}</h4>
				<p className="text-xs leading-relaxed text-white/40">{props.description}</p>
			</div>
		</div>
	);
}

/**
 * AIママ サービス紹介ページ（ZXY構成準拠）
 */
export default function Page() {
	return (
		<main className="min-h-screen bg-background-default text-white selection:bg-primary-main/30">
			{/* 背景グラデーション */}
			<div className="fixed inset-0 z-0 pointer-events-none opacity-20">
				<div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary-main/20 blur-[150px]" />
				<div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-secondary-main/20 blur-[150px]" />
			</div>

			<Header />

			<div className="relative z-10">
				<Breadcrumb />

				{/* ヒーローヘッダー */}
				<section className="mx-auto max-w-7xl px-6 py-12 lg:py-24 text-center">
					<h1 className="mb-6 text-5xl font-black tracking-tighter sm:text-7xl">
						AIママ サービス紹介
					</h1>
					<p className="mx-auto max-w-2xl text-lg font-medium text-white/60 sm:text-xl">
						「高セキュア×多用途」なAIモニタリング。
						あなたの可処分時間を最大化する、理想の集中環境をクラウドで提供します。
					</p>
				</section>

				{/* 監視モード紹介 */}
				<section className="mx-auto max-w-7xl px-6 py-12">
					<SectionTitle
						title="監視モード"
						subtitle="目的や人数、シチュエーションに合わせて最適なAI解析アルゴリズムを選択できます。"
					/>
					<div className="grid gap-6">
						<FeatureItem
							title="集中・フォーカスモード"
							tags={["単独利用", "高精度監視", "即時フィードバック"]}
							description="スマホの使用、読書、学習、PC作業などをAIがリアルタイムに峻別します。少しでも集中が途切れるとAIママが優しく（あるいは厳しく）注意。施錠可能な個室での利用のように、外界をシャットアウトしてタスクに没頭したい時に最適です。"
							icon={<Cpu className="h-8 w-8 lg:h-12 lg:w-12" />}
						/>
						<FeatureItem
							title="複数人・プロジェクトモード"
							tags={["チーム利用", "対話分析", "会議効率化"]}
							description="ホワイトボードの使用状況や、参加者の発言頻度、スマートフォンの使用率などをチーム単位で計測。会議が「浪費」に陥っていないか、LLMが対話の内容まで含めてハイブリッドに解析します。クライアントを招いての商談や打ち合わせの生産性を最大化します。"
							icon={<Users className="h-8 w-8 lg:h-12 lg:w-12" />}
						/>
						<FeatureItem
							title="習慣定着・ルーチンモード"
							tags={["継続支援", "データ可視化", "モバイル連携"]}
							description="毎日の筋トレや読書など、目に見えにくい「スキマ時間」の活用に特化。AIカメラが定点観測を行い、目標とする行動がとれているかをチェックします。アポイントの合間を生産時間に変換するなど、様々なライフスタイルをサポートします。"
							icon={<Clock className="h-8 w-8 lg:h-12 lg:w-12" />}
						/>
					</div>
				</section>

				{/* 基本設備紹介 */}
				<section className="mx-auto max-w-7xl px-6 py-12">
					<SectionTitle title="基本設備・機能" />
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<FacilityGridItem
							title="セキュリティ環境"
							description="SSL通信とAIエッジ処理により、映像データは高度に保護。プライバシーを守りながら監視を実現します。"
							icon={<ShieldCheck />}
						/>
						<FacilityGridItem
							title="高速Wi-Fi・クラウド連携"
							description="解析データは瞬時にクラウドへ同期。PCやスマホからいつでも活動レポートを確認可能です。"
							icon={<Wifi />}
						/>
						<FacilityGridItem
							title="活動レポート発行"
							description="毎日の行動を一目で把握。LLMがあなたの強みと弱みを分析し、アドバイスを生成します。"
							icon={<BarChart3 />}
						/>
						<FacilityGridItem
							title="音声・サウンドフィードバック"
							description="不自然な行動を検知するとAI音声で警告。心地よい集中サウンドの提供も行います。"
							icon={<Mic2 />}
						/>
						<FacilityGridItem
							title="マルチデバイス対応"
							description="専用カメラだけでなく、スマホアプリ経由での簡易モニタリングにも対応しています。"
							icon={<Smartphone />}
						/>
						<FacilityGridItem
							title="高度なAI設定"
							description="監視の厳しさや通知タイミング、禁止行動の定義などを自由自在にカスタマイズ可能です。"
							icon={<Settings />}
						/>
					</div>
				</section>

				{/* よくある質問 */}
				<section className="mx-auto max-w-7xl px-6 py-24">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-md">
						<div className="flex flex-col items-center justify-between gap-8 md:flex-row">
							<div>
								<h2 className="mb-4 text-3xl font-bold">もっと詳しく知りたいですか？</h2>
								<p className="text-white/50">機能のカスタマイズや企業導入に関するご相談も承っております。</p>
							</div>
							<div className="flex flex-wrap gap-4">
								<Link href="#" className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-gray-900 transition-transform hover:scale-105 active:scale-95">
									<Search className="h-5 w-5" />
									詳細マニュアル
								</Link>
								<Link href="#" className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-bold text-white transition-all hover:bg-white/20">
									<HelpCircle className="h-5 w-5" />
									よくある質問
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* フッター */}
				<footer className="border-t border-white/5 bg-black/20 py-16">
					<div className="mx-auto max-w-7xl px-6 text-center">
						<div className="mb-8 flex justify-center gap-8">
							<Link href="/" className="text-sm font-medium text-white/40 hover:text-white transition-colors">利用規約</Link>
							<Link href="/" className="text-sm font-medium text-white/40 hover:text-white transition-colors">プライバシーポリシー</Link>
							<Link href="/" className="text-sm font-medium text-white/40 hover:text-white transition-colors">お問い合わせ</Link>
						</div>
						<p className="text-xs text-white/20">© 2026 AI MAMA Inc. All rights reserved.</p>
					</div>
				</footer>
			</div>
		</main>
	);
}