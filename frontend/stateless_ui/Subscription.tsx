//- X(Twitter)風の課金プラン画面です
//- <Plan annual={true} ...></Plan>というコンポーネントを実装してください
//- <AnnualSwitch />というコンポーネントをSlideSwitchで実装してください。annual={false}はmonthlyを意味します
//- Exampleでは<AnnualSwitch /><Plan>Free...</Plan><Plan>Unlimited...</Plan>のように実装してX風にして
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//stateless_ui/以下のTsxに適用するルール
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して
import React, { ComponentProps, ReactNode, useState } from 'react';
import { Check } from 'lucide-react';
import { SlideSwitch } from './SlideSwitch';;

// ==========================================
// Components
// ==========================================

/**
 * 年額/月額切り替えスイッチ
 * SlideSwitchを使用して実装
 * annual=true => 年額 (Annual)
 * annual=false => 月額 (Monthly)
 */
export function AnnualSwitch(props: Pick<ComponentProps<typeof SlideSwitch>, "value" | "onChange" | "className"> & { saveLabel: ReactNode }) {
	return (<SlideSwitch
		NodeTrue={
			<div className="flex items-center gap-2">
				<span>年額</span>
				{props.saveLabel}
			</div>
		}
		NodeFalse={
			<span>月額</span>
		}
		// annual=true (年額) をTrueとする
		leftIsTrue={true} // 右(年額)をActiveにしたい場合、SlideSwitchの仕様を確認
		// SlideSwitchの仕様:
		// leftIsTrue = true:  value=true -> Left
		// leftIsTrue = false: value=true -> Right
		// ここでは「年額」を右側に配置し、annual=trueの時に右側(年額)をActiveにしたいので、
		// leftIsTrue=false (value=true is Right) で、NodeTrue(年額)をPassする
		// NodeTrue: 年額, NodeFalse: 月額, leftIsTrue: false
		// value=true (annual) -> Right (NodeTrue: 年額) Active
		// value=false (!annual) -> Left (NodeFalse: 月額) Active

		value={props.value}
		onChange={props.onChange}
		className='my-5 w-100'
	/>
	);
}

/**
 * 課金プランカード
 */
export function Plan(props: {
	annual: boolean;
	title: ReactNode;
	price: ReactNode;
	currency: "yen" | "dollar";
	features: ReactNode[];
	recommended?: boolean;
	buttonLabel: ReactNode;
	onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`
                flex flex-col p-6 rounded-3xl border relative transition-all duration-300
                ${props.recommended
					? 'border-primary-main bg-background-paper shadow-lg scale-105 z-10'
					: 'border-divider bg-background-default hover:bg-background-paper'
				}
                ${props.className || ''}
            `}
		>
			{props.recommended && (
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-main text-primary-contrast text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
					Recommended
				</div>
			)}

			<div className="mb-4">
				<h3 className="text-xl font-bold text-text-primary mb-1">{props.title}</h3>
				<div className="flex items-baseline gap-1">
					<span className="text-3xl font-extrabold text-text-primary">{props.price}</span>
					<span className="text-sm text-text-secondary">/ {props.annual ? '年' : '月'}</span>
				</div>
			</div>

			<ul className="flex-1 space-y-3 mb-8">
				{props.features.map((feature, index) => (
					<li key={index} className="flex items-start gap-3 text-sm text-text-primary">
						<Check className="w-5 h-5 text-primary-main flex-shrink-0" />
						<span>{feature}</span>
					</li>
				))}
			</ul>

			<div className="mt-auto">
				<button
					className={`
                        w-full py-3 px-4 rounded-full font-bold text-sm transition-colors
                        ${props.recommended
							? 'bg-primary-main text-primary-contrast hover:bg-primary-dark'
							: 'bg-background-paper text-text-primary border border-divider hover:bg-action-hover'
						}
                    `}
					onClick={props.onButtonClick}
				>
					{props.buttonLabel}
				</button>
			</div>
			{props.children}
		</div>
	);
}

export function Badge(props: { children?: ReactNode }) {
	return (
		<span className={"text-xs font-bold text-primary-main bg-primary-main/10 px-2 py-0.5 rounded-full"}>
			{props.children}
		</span>
	);
}
export function Price(props: { children?: ReactNode }) {
	return (
		<span className={"text-3xl font-extrabold text-text-primary"}>
			{props.children}
		</span>
	);
}

export type PlanSubscriptionProps =
	Omit<ComponentProps<typeof Plan>, "annual" | "price" | "buttonLabel" | "onButtonClick"> &
	{ value: string, priceAnnual: ReactNode, priceMonthly: ReactNode };
/**
 * Example component
 */
export function Subscription(props: {
	title: ReactNode,
	description: ReactNode,
	saveLabel: ReactNode,
	value: string,
	plans: PlanSubscriptionProps[],
	onButtonClick?: React.MouseEventHandler<HTMLButtonElement>,
}) {
	const [isAnnual, setIsAnnual] = useState(true);

	return (
		<div className="min-h-screen bg-background-default p-8 flex flex-col items-center">
			<div className="text-center mb-10">
				<h2 className="text-4xl font-extrabold text-text-primary mb-4">{props.title}</h2>
				<p className="text-text-secondary max-w-md mx-auto">
					{props.description}
				</p>
			</div>

			<AnnualSwitch value={isAnnual} onChange={setIsAnnual} saveLabel={<Badge>SAVE 12%</Badge>} />

			<div className="flex flex-col md:flex-row justify-center gap-6 max-w-5xl w-full items-start flex-wrap">
				{
					props.plans.map((plan, index) => {
						const { priceAnnual, priceMonthly, ...rest } = plan;
						return (
							<Plan
								key={index}
								annual={isAnnual}
								price={isAnnual ? priceAnnual : priceMonthly}
								buttonLabel={props.value === plan.value ? "Current" : "Subscription & Payment"}
								onButtonClick={() => { }}
								{...rest}
							/>
						)
					})
				}
			</div>
		</div>
	);
}

/**
 * Example component
 */
export function Example() {
	return (
		<Subscription
			title="Upgrade to Premium"
			description="コンテンツ制作を楽しみ、収益化するための最適なプランをお選びください。"
			saveLabel="-12%"
			value="free"
			plans={[
				{
					value: "free",
					title: "Free",
					priceAnnual: 0,
					priceMonthly: 0,
					currency: "yen",
					features: [
						"基本的な動画視聴",
						"プレイリストの作成",
						"広告あり"
					]
				},
				{
					value: "unlimited",
					title: "Unlimited",
					priceAnnual: 980,
					priceMonthly: 980,
					currency: "yen",
					features: [
						"広告なしで再生",
						"バックグラウンド再生",
						"高画質ダウンロード",
						"オリジナルステッカー"
					]
				},
			]}
		/>
	);
}
