import Container from "./Container";

/**
 * プラン選択ページ用のProps
 * @param is_activated - 現在Unlimitedプランが有効かどうか
 * @param onSelectUnlimited - Unlimitedプラン選択（アップグレード）時の処理
 * @param onCancel - プラン解約時の処理
 */
export interface PlanSelectionUIProps {
	is_activated: boolean;
	onSelectUnlimited: () => void;
	onCancel: () => void;
}

/**
 * プラン選択UI。
 * Unlimitedプランのカードと、Freeプランとの機能比較表を表示します。
 */
export function PlanSelectionUI(props: PlanSelectionUIProps) {
	return (
		<Container className="py-12">
			<div className="text-center mb-12">
				<h1 className="text-3xl font-bold text-text-primary">プランの管理</h1>
				<p className="text-text-secondary mt-2">ご利用状況の確認とプランの変更が可能です。</p>
			</div>

			<div className="max-w-3xl mx-auto">
				{/* Unlimited プランカード */}
				<div className="bg-background-paper border-2 border-primary-main rounded-2xl p-8 flex flex-col shadow-xl relative overflow-hidden transition-transform hover:scale-[1.01]">
					<div className="absolute top-0 right-0 bg-primary-main text-primary-contrast px-6 py-1 text-sm font-bold rounded-bl-lg">
						Unlimited
					</div>

					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h2 className="text-2xl font-bold text-primary-main">Unlimited プラン</h2>
							<p className="text-text-secondary">プロフェッショナルな制作に最適です。</p>
						</div>
						<div className="text-right">
							<div className="text-4xl font-bold">
								¥2,980 <span className="text-sm font-normal text-text-secondary">/ 月</span>
							</div>
						</div>
					</div>

					{/* 機能比較表 */}
					<div className="mb-10 overflow-hidden border border-divider rounded-xl">
						<table className="w-full text-left bg-background-default/50">
							<thead>
								<tr className="bg-primary-main/5">
									<th className="p-4 border-b border-divider font-bold">機能</th>
									<th className="p-4 border-b border-divider text-center text-text-secondary">フリー</th>
									<th className="p-4 border-b border-divider text-center text-primary-main">Unlimited</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-divider">
								<tr>
									<td className="p-4">月間生成回数</td>
									<td className="p-4 text-center text-text-secondary">5回</td>
									<td className="p-4 text-center font-bold">100回</td>
								</tr>
								<tr>
									<td className="p-4">利用可能モデル</td>
									<td className="p-4 text-center text-text-secondary">標準</td>
									<td className="p-4 text-center font-bold">最新・高品質</td>
								</tr>
								<tr>
									<td className="p-4">サポート</td>
									<td className="p-4 text-center text-text-secondary">コミュニティ</td>
									<td className="p-4 text-center font-bold">優先・個別</td>
								</tr>
								<tr>
									<td className="p-4">商用利用</td>
									<td className="p-4 text-center text-text-secondary">不可</td>
									<td className="p-4 text-center font-bold">可能</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="mt-auto flex flex-col gap-4">
						{props.is_activated ? (
							<div className="space-y-4">
								<div className="bg-success-light/10 border border-success-main/20 rounded-lg p-4 text-success-dark flex items-center gap-3">
									<span className="text-xl">✓</span>
									<span className="font-bold">現在 Unlimited プランが有効です</span>
								</div>
								<button
									onClick={props.onCancel}
									className="w-full py-4 px-6 border-2 border-error-main text-error-main rounded-full font-bold hover:bg-error-main hover:text-error-contrast transition-all shadow-sm"
								>
									プランを解約する
								</button>
							</div>
						) : (
							<button
								onClick={props.onSelectUnlimited}
								className="w-full py-4 px-6 bg-primary-main text-primary-contrast rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg text-lg"
							>
								Unlimited にアップグレード
							</button>
						)}
					</div>
				</div>

				<p className="mt-8 text-center text-sm text-text-secondary">
					※ 解約はいつでも可能です。次回の更新日までサービスをご利用いただけます。
				</p>
			</div>
		</Container>
	);
}

/**
 * Stateless UI部品の一覧を確認するためのExampleコンポーネント。
 */
export function Example() {
	return (
		<div className="bg-background-default min-h-screen p-8 space-y-12">
			<div>
				<h3 className="text-center text-sm text-text-secondary mb-4">未契約状態</h3>
				<PlanSelectionUI
					is_activated={false}
					onSelectUnlimited={() => console.log("Upgrade selected")}
					onCancel={() => console.log("Cancel selected")}
				/>
			</div>
			<hr />
			<div>
				<h3 className="text-center text-sm text-text-secondary mb-4">契約済み状態</h3>
				<PlanSelectionUI
					is_activated={true}
					onSelectUnlimited={() => console.log("Upgrade selected")}
					onCancel={() => console.log("Cancel selected")}
				/>
			</div>
		</div>
	);
}
