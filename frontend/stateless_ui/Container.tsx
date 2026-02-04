export default function Container(props: { children: React.ReactNode, className?: string }) {
	// childrenをコンテナ幅としてより狭く表示する
	// 中央に寄せる
	return (
		<div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${props.className}`}>
			{props.children}
		</div>
	)
}