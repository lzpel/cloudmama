/**
 * サイドバーレイアウトを提供するコンポーネント
 */
export function SideLayout(props: { children: React.ReactNode, side: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<aside className="w-64 bg-gray-400/20 text-white flex-shrink-0 h-full">
				<div className="p-4 h-full">
					{props.side}
				</div>
			</aside>
			<main className="flex-1 bg-gray-400/10 overflow-y-auto">
				<div className="p-6">
					{props.children}
				</div>
			</main>
		</div>
	)
}