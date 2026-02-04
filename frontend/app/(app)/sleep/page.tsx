//- 今日の睡眠時間を横軸12時から翌12時で縦軸0-100%で表示する折れ線グラフを書いて
//- グラフの横軸の下にそれぞれの画像をfrontend\public\dailyから表示して
//ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止、またexport function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上のルールは保持し以降に内容を実装して

import React from 'react';
import Image from 'next/image';
import { Moon, Sun, MoreVertical, Share2, Download, Activity } from 'lucide-react';

/**
 * 睡眠データの型定義
 */
type SleepDataPoint = {
	hour: number;
	level: number; // 0-100
};

/**
 * 睡眠解析グラフコンポーネント
 * SVGを使用して滑らかな折れ線グラフを描画します。
 */
export function SleepChart(props: { data: SleepDataPoint[] }) {
	const width = 1000;
	const height = 300;
	const padding = 40;

	// データ点からステップ関数のパスを生成 (0か1のバイナリ表示)
	const points: string[] = [];
	props.data.forEach(function (d: SleepDataPoint, i: number) {
		const x = (i / (props.data.length - 1)) * (width - padding * 2) + padding;
		const y = height - (d.level / 100) * (height - padding * 2) - padding;

		if (i === 0) {
			points.push(`${x},${y}`);
		} else {
			// 前の点からの水平線を追加してステップ状にする
			const prevX = ((i - 1) / (props.data.length - 1)) * (width - padding * 2) + padding;
			points.push(`${x},${points[points.length - 1].split(',')[1]}`); // 前のYを維持した水平線
			points.push(`${x},${y}`); // 垂直に移動
		}
	});

	const pathData = `M ${points.join(' L ')}`;
	const areaData = `${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

	return (
		<div className="relative w-full overflow-x-auto pb-4">
			<div className="min-w-[800px] h-[400px]">
				<svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
					{/* 背景のグリッド線 */}
					{[0, 100].map(function (val: number) {
						const y = height - (val / 100) * (height - padding * 2) - padding;
						let label = "";
						if (val === 100) label = "睡眠";
						if (val === 0) label = "覚醒";

						return (
							<g key={val}>
								<line
									x1={padding}
									y1={y}
									x2={width - padding}
									y2={y}
									stroke="currentColor"
									className="text-divider opacity-20"
									strokeWidth="1"
								/>
								{label && (
									<text
										x={padding - 10}
										y={y + 4}
										textAnchor="end"
										className="text-[10px] fill-text-secondary font-bold"
									>
										{label}
									</text>
								)}
							</g>
						);
					})}

					{/* グラフのエリア塗りつぶし */}
					<path
						d={areaData}
						fill="url(#chartGradient)"
						className="opacity-30"
					/>

					{/* グラフの折れ線 */}
					<path
						d={pathData}
						fill="none"
						stroke="rgb(var(--palette-primary-main))"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]"
					/>

					{/* データポイントのドット（要所のみ） */}
					{props.data.map(function (d: SleepDataPoint, i: number) {
						if (i % 3 !== 0 && i !== props.data.length - 1) return null;
						const x = (i / (props.data.length - 1)) * (width - padding * 2) + padding;
						const y = height - (d.level / 100) * (height - padding * 2) - padding;
						return (
							<g key={i} className="group cursor-pointer">
								<circle
									cx={x}
									cy={y}
									r="4"
									fill="rgb(var(--palette-primary-main))"
									className="transition-all duration-300 group-hover:r-6"
								/>
								<circle
									cx={x}
									cy={y}
									r="8"
									fill="rgb(var(--palette-primary-main))"
									className="opacity-0 group-hover:opacity-20 transition-opacity"
								/>
							</g>
						);
					})}

					{/* X軸のラベル */}
					{props.data.map(function (d: SleepDataPoint, i: number) {
						if (i % 3 !== 0 && i !== props.data.length - 1) return null;
						const x = (i / (props.data.length - 1)) * (width - padding * 2) + padding;
						return (
							<text
								key={`label-${i}`}
								x={x}
								y={height - 10}
								textAnchor="middle"
								className="text-[12px] fill-text-secondary font-bold"
							>
								{d.hour}:00
							</text>
						);
					})}

					{/* グラデーション定義 */}
					<defs>
						<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="rgb(var(--palette-primary-main))" stopOpacity="0.8" />
							<stop offset="100%" stopColor="rgb(var(--palette-primary-main))" stopOpacity="0" />
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>
	);
}

/**
 * 1時間ごとの活動画像を表示するコンポーネント
 */
export function ActivityTimeline(props: { data: SleepDataPoint[] }) {
	return (
		<div className="mt-8 flex overflow-x-auto gap-4 pb-6 px-4 scrollbar-hide">
			{props.data.map(function (d: SleepDataPoint, i: number) {
				// 24時間分のみ表示（最後の25点目は翌12時なのでスキップ）
				if (i === props.data.length - 1) return null;

				const hourPadded = d.hour.toString().padStart(3, '0');
				const imagePath = `/daily/${hourPadded}.png`;

				return (
					<div key={i} className="flex-none flex flex-col items-center gap-2 group">
						<div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-divider group-hover:border-primary-main transition-colors duration-300 shadow-lg">
							<Image
								src={imagePath}
								alt={`${d.hour}時`}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
						</div>
						<div className="flex flex-col items-center">
							<span className="text-[10px] font-black text-text-primary">{d.hour}:00</span>
							<div className={`w-1 h-4 mt-1 rounded-full ${d.level < 30 ? 'bg-indigo-500' : 'bg-primary-main'} opacity-50`} />
						</div>
					</div>
				);
			})}
		</div>
	);
}

/**
 * 睡眠解析ページ
 */
export default function Page() {
	// ダミーデータの生成 (12:00から翌12:00まで、0:覚醒 100:睡眠)
	const sleepData: SleepDataPoint[] = [
		{ hour: 12, level: 0 }, { hour: 13, level: 0 }, { hour: 14, level: 0 },
		{ hour: 15, level: 0 }, { hour: 16, level: 0 }, { hour: 17, level: 0 },
		{ hour: 18, level: 0 }, { hour: 19, level: 0 }, { hour: 20, level: 0 },
		{ hour: 21, level: 0 }, { hour: 22, level: 0 }, { hour: 23, level: 100 },
		{ hour: 0, level: 100 }, { hour: 1, level: 100 }, { hour: 2, level: 100 },
		{ hour: 3, level: 100 }, { hour: 4, level: 100 }, { hour: 5, level: 100 },
		{ hour: 6, level: 100 }, { hour: 7, level: 100 }, { hour: 8, level: 0 },
		{ hour: 9, level: 0 }, { hour: 10, level: 0 }, { hour: 11, level: 0 },
		{ hour: 12, level: 0 }
	];

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
			{/* ヘッダーセクションを削除：要求通りタイトルと日付を消去 */}

			{/* メインコンテンツ: グラフとタイムライン（枠線と背景を削除） */}
			<section className="py-4 overflow-hidden">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-xl font-black text-text-primary">睡眠グラフ</h2>
					<div className="flex gap-4">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-primary-main" />
							<span className="text-xs font-bold text-text-secondary">睡眠状態</span>
						</div>
					</div>
				</div>

				<SleepChart data={sleepData} />

				<div className="mt-12">
					<h3 className="text-sm font-black text-text-primary border-l-4 border-primary-main pl-3 mb-6">
						ハイライト解析画像
					</h3>
					<ActivityTimeline data={sleepData} />
				</div>
			</section>

			{/* 分析セクション */}
			<section className="bg-primary-main text-white p-8 rounded-3xl relative overflow-hidden group">
				<div className="absolute top-0 right-0 p-8 opacity-10 blur-sm scale-150 group-hover:scale-110 transition-transform duration-700">
					<Moon size={120} />
				</div>
				<div className="relative z-10 max-w-2xl">
					<h2 className="text-2xl font-black mb-4">分析</h2>
					<p className="text-lg opacity-90 leading-relaxed font-medium">
						全体として非常に規則正しい睡眠サイクルが維持されていますが、グラフを見ると23時ごろに覚醒から睡眠への切り替わりが不安定になっています。
						この時間帯、ベッドの上でスマートフォンを操作されているようです。
						スマートフォンのブルーライトはメラトニン生成を抑制し、入眠の質を低下させます。22時30分以降はデジタルデトックスを心がけることで、翌朝の覚醒度をさらに高めることができるでしょう。
					</p>
				</div>
			</section>
		</div>
	);
}

/**
 * サンドボックス表示用のExampleコンポーネント
 */
export function Example() {
	return <Page />;
}