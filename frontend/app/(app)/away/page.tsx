//- 今日の不在時間を時系列で表示する
//- 睡眠・スマホページと同様のスタイルで、不在（外出等）のオン/オフをバイナリグラフで表示
//ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止、またexport function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。

import React from 'react';
import { UserMinus, MapPin, Coffee, Zap } from 'lucide-react';

/**
 * 不在データの型定義
 */
type AwayDataPoint = {
	hour: number;
	active: number; // 0: 在室, 100: 不在
};

/**
 * 不在時間グラフコンポーネント
 */
export function AwayChart(props: { data: AwayDataPoint[] }) {
	const width = 1000;
	const height = 200;
	const padding = 40;

	const points: string[] = [];
	props.data.forEach(function (d: AwayDataPoint, i: number) {
		const x = (i / (props.data.length - 1)) * (width - padding * 2) + padding;
		const y = height - (d.active / 100) * (height - padding * 2) - padding;

		if (i === 0) {
			points.push(`${x},${y}`);
		} else {
			points.push(`${x},${points[points.length - 1].split(',')[1]}`);
			points.push(`${x},${y}`);
		}
	});

	const pathData = `M ${points.join(' L ')}`;

	return (
		<div className="relative w-full overflow-x-auto pb-4">
			<div className="min-w-[800px] h-[300px]">
				<svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
					{[0, 100].map(function (val: number) {
						const y = height - (val / 100) * (height - padding * 2) - padding;
						let label = val === 100 ? "不在" : "在室";
						return (
							<g key={val}>
								<line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" className="text-divider opacity-20" />
								<text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-text-secondary font-bold">{label}</text>
							</g>
						);
					})}
					<path d={pathData} fill="none" stroke="rgb(var(--palette-primary-main))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
					{props.data.map(function (d: AwayDataPoint, i: number) {
						if (i % 3 !== 0) return null;
						const x = (i / (props.data.length - 1)) * (width - padding * 2) + padding;
						return <text key={i} x={x} y={height - 10} textAnchor="middle" className="text-[12px] fill-text-secondary font-bold">{d.hour}:00</text>;
					})}
				</svg>
			</div>
		</div>
	);
}

/**
 * 不在解析ページ
 */
export default function Page() {
	const awayData: AwayDataPoint[] = [
		{ hour: 12, active: 0 }, { hour: 13, active: 100 }, { hour: 14, active: 100 },
		{ hour: 15, active: 100 }, { hour: 16, active: 100 }, { hour: 17, active: 100 },
		{ hour: 18, active: 0 }, { hour: 19, active: 0 }, { hour: 20, active: 0 },
		{ hour: 21, active: 0 }, { hour: 22, active: 0 }, { hour: 23, active: 0 },
		{ hour: 0, active: 0 }, { hour: 1, active: 0 }, { hour: 2, active: 0 },
		{ hour: 3, active: 0 }, { hour: 4, active: 0 }, { hour: 5, active: 0 },
		{ hour: 6, active: 0 }, { hour: 7, active: 0 }, { hour: 8, active: 0 },
		{ hour: 9, active: 0 }, { hour: 10, active: 0 }, { hour: 11, active: 0 },
		{ hour: 12, active: 0 }
	];

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700">
			<section>
				<h2 className="text-xl font-black text-text-primary mb-8 underline decoration-primary-main decoration-4 underline-offset-8">不在グラフ</h2>
				<AwayChart data={awayData} />
			</section>

			<section className="bg-primary-main text-white p-8 rounded-3xl relative overflow-hidden">
				<div className="relative z-10 max-w-2xl">
					<h2 className="text-2xl font-black mb-4 flex items-center gap-3">
						<MapPin className="h-6 w-6" />
						分析
					</h2>
					<p className="text-lg opacity-90 leading-relaxed font-medium">
						本日は13時から18時まで外出されており、その間の活動データは記録されていません。
						この外出時間を有効な「リフレッシュ（可処分時間の質向上）」として活用できていれば、帰宅後の集中力が向上するはずです。
						帰宅後のタスク消化率が著しく高くなっていることが確認されています。
					</p>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="p-6 bg-background-paper border border-divider rounded-2xl">
					<h3 className="text-sm font-black text-text-secondary uppercase tracking-widest mb-4">外出中の推測活動</h3>
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Coffee className="text-primary-main" size={20} />
							<span className="text-text-primary font-bold">カフェ・休息</span>
						</div>
						<div className="flex items-center gap-3">
							<Zap className="text-primary-main" size={20} />
							<span className="text-text-primary font-bold">移動・アクティブ</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export function Example() {
	return <Page />;
}
