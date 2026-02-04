// app/page.tsx
import Image from "next/image";

export default function Profile() {
	return (
		<main className="min-h-screen bg-slate-50 text-slate-900">
			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
					<p className="text-sm font-semibold text-orange-500">
						作物見守りサービス
					</p>
					<h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
						plant mimamori で、
						<br className="hidden md:block" />
						畑の“いま”をスマホから見守る
					</h1>
					<p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
						plant mimamori は、撮影した圃場写真を AI が自動解析し、
						本数カウントや生育状況を可視化するクラウドサービスです。
						グラフ・地図・画像認識ビューを使って、離れた場所からでも
						作物の状態を素早く把握できます。
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-4">
						<a
							href="/signup"
							className="rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600"
						>
							無料で始める
						</a>
						<span className="text-sm text-slate-500">
							Google アカウントまたはメールアドレスで登録できます
						</span>
					</div>
				</div>
			</section>

			{/* Screenshots */}
			<section className="bg-white">
				<div className="mx-auto max-w-5xl space-y-10 px-4 py-12 md:py-16">
					<h2 className="text-2xl font-semibold">画面イメージ</h2>
					<div className="grid gap-8 md:grid-cols-3">
						<figure className="rounded-xl border bg-slate-50 p-3 shadow-sm">
							<img
								src="https://storage.googleapis.com/lzpelshare/20251207-mimamori/fig_detect.png"
								alt="画像認識ビューの例"
								width={800}
								height={600}
								className="h-auto w-full rounded-lg"
							/>
							<figcaption className="mt-2 text-xs text-slate-500">
								AI による自動カウント（画像認識ビュー）
							</figcaption>
						</figure>

						<figure className="rounded-xl border bg-slate-50 p-3 shadow-sm">
							<img
								src="https://storage.googleapis.com/lzpelshare/20251207-mimamori/fig_sign.png"
								alt="サインアップ画面の例"
								width={800}
								height={600}
								className="h-auto w-full rounded-lg"
							/>
							<figcaption className="mt-2 text-xs text-slate-500">
								シンプルな新規登録画面
							</figcaption>
						</figure>

						<figure className="rounded-xl border bg-slate-50 p-3 shadow-sm">
							<img
								src="https://storage.googleapis.com/lzpelshare/20251207-mimamori/fig_map.png"
								alt="地図ビューの例"
								width={800}
								height={600}
								className="h-auto w-full rounded-lg"
							/>
							<figcaption className="mt-2 text-xs text-slate-500">
								撮影地点を地図上に表示（マップビュー）
							</figcaption>
						</figure>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="bg-slate-900">
				<div className="mx-auto max-w-5xl px-4 py-14 md:py-18 text-slate-50">
					<h2 className="text-2xl font-semibold">主な機能</h2>
					<div className="mt-8 grid gap-8 md:grid-cols-3">
						<div>
							<h3 className="text-lg font-semibold">AI 画像認識</h3>
							<p className="mt-2 text-sm text-slate-300">
								撮影した画像から作物の本数や株の位置を自動検出。
								手作業のカウントを大幅に削減します。
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold">グラフで生育を可視化</h3>
							<p className="mt-2 text-sm text-slate-300">
								撮影日ごとの「値」や本数の推移をグラフで表示。
								生育の変化や異常を早期に把握できます。
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold">地図で圃場を一覧</h3>
							<p className="mt-2 text-sm text-slate-300">
								撮影場所を地図上にマッピング。
								どの圃場でいつ撮影したかを直感的に振り返れます。
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Problem / Solution */}
			<section className="bg-white">
				<div className="mx-auto max-w-5xl px-4 py-14 md:py-18">
					<h2 className="text-2xl font-semibold">こんな課題はありませんか？</h2>
					<div className="mt-6 grid gap-8 md:grid-cols-2">
						<ul className="space-y-2 text-sm text-slate-700">
							<li>・本数カウントや生育確認に時間がかかる</li>
							<li>・圃場が離れていて、見回りが大変</li>
							<li>・作業記録が紙や写真のままで整理しづらい</li>
						</ul>
						<p className="text-sm text-slate-700">
							plant mimamori は、これらの作業を
							<strong>「撮影してアップロードするだけ」</strong>
							のワークフローに変えます。AI が自動解析し、
							Web ブラウザ上で結果を確認できるので、
							現場と事務所の両方で同じ情報を共有できます。
						</p>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="bg-slate-100">
				<div className="mx-auto max-w-5xl px-4 py-14 md:py-18">
					<h2 className="text-2xl font-semibold">ご利用の流れ</h2>
					<ol className="mt-6 grid gap-4 text-sm text-slate-700 md:grid-cols-3">
						<li className="rounded-lg bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold text-orange-500">Step 1</p>
							<p className="mt-2 font-semibold">スマホで圃場を撮影</p>
							<p className="mt-1">
								いつも通り圃場を撮影。撮影地点の位置情報も一緒に記録されます。
							</p>
						</li>
						<li className="rounded-lg bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold text-orange-500">Step 2</p>
							<p className="mt-2 font-semibold">plant mimamori にアップロード</p>
							<p className="mt-1">
								Web 画面から画像をアップロードするだけで AI が自動解析します。
							</p>
						</li>
						<li className="rounded-lg bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold text-orange-500">Step 3</p>
							<p className="mt-2 font-semibold">結果をグラフと地図で確認</p>
							<p className="mt-1">
								本数カウント、スコア、「値」の推移を一覧。
								異常な圃場もすぐに見つけられます。
							</p>
						</li>
					</ol>

					<div className="mt-10 text-center">
						<a
							href="/signup"
							className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600"
						>
							今すぐアカウントを作成する
						</a>
						<p className="mt-3 text-xs text-slate-500">
							ベータ版につき、一部機能は順次追加予定です。
						</p>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t bg-white">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-xs text-slate-500">
					<span>© {new Date().getFullYear()} plant mimamori</span>
					<span>開発元: サーフィック合同会社 https://surfic.com</span>
				</div>
			</footer>
		</main>
	);
}