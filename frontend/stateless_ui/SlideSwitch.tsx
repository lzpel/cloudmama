import React from 'react';

// ==========================================
// Types
// ==========================================

type SlideSwitchProps = {
	NodeTrue: React.ReactNode;
	NodeFalse: React.ReactNode;
	leftIsTrue: boolean; // true: Left=True, Right=False | false: Left=False, Right=True
	onChange: (checked: boolean) => void;
	value: boolean;
	className?: string;
};

// ==========================================
// Components
// ==========================================

/**
 * 左右のスライドスイッチ
 * NodeTrueとNodeFalseをスイッチの中に配置し、スライドアニメーションで切り替える
 */
export function SlideSwitch(props: SlideSwitchProps) {
	// valueとleftIsTrueの組み合わせでスライダーの位置を決定
	// leftIsTrue = true:  value=true -> Left (active), value=false -> Right
	// leftIsTrue = false: value=true -> Right (active), value=false -> Left

	// 左側がアクティブかどうか
	// leftIsTrue && value  => Left Active (True)
	// !leftIsTrue && !value => Left Active (False)
	const isLeftActive = (props.leftIsTrue && props.value) || (!props.leftIsTrue && !props.value);

	return (
		<div
			className={`relative inline-flex items-center bg-action-disabledBackground rounded-lg cursor-pointer select-none transition-colors ${props.className || ''}`}
			onClick={() => props.onChange(!props.value)}
		>
			{/* Slider Background */}
			<div
				className={`
                    absolute bg-background-paper shadow-sm rounded-md transition-all duration-300 ease-in-out
                    h-[calc(100%-8px)] top-1 bottom-1
                `}
				style={{
					left: isLeftActive ? '4px' : '50%',
					width: 'calc(50% - 4px)'
				}}
			/>

			{/* Nodes Container */}
			<div className="flex w-full relative z-10">
				{/* Left Side */}
				<div className={`flex-1 flex items-center justify-center px-4 py-2 transition-colors duration-300 ${isLeftActive ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
					{props.leftIsTrue ? props.NodeTrue : props.NodeFalse}
				</div>

				{/* Right Side */}
				<div className={`flex-1 flex items-center justify-center px-4 py-2 transition-colors duration-300 ${!isLeftActive ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
					{props.leftIsTrue ? props.NodeFalse : props.NodeTrue}
				</div>
			</div>
		</div>
	);
}

/**
 * Example component
 */
export function Example() {
	const [isOn, setIsOn] = React.useState(false);
	return (
		<div className="flex flex-col items-center gap-8 p-8 bg-background-default">
			<h3 className="text-xl font-bold text-text-primary">Slide Switch Examples</h3>

			<div className="space-y-4">
				<div className="flex flex-col items-center gap-2">
					<p className="text-text-secondary text-sm">Left is True (ON)</p>
					<SlideSwitch
						NodeTrue={<span>ON</span>}
						NodeFalse={<span>OFF</span>}
						leftIsTrue={true}
						value={isOn}
						onChange={setIsOn}
						className="w-48"
					/>
				</div>

				<div className="flex flex-col items-center gap-2">
					<p className="text-text-secondary text-sm">Right is True (Annual)</p>
					<SlideSwitch
						NodeTrue={<span>Annual</span>}
						NodeFalse={<span>Monthly</span>}
						leftIsTrue={false}
						value={isOn}
						onChange={setIsOn}
						className="w-64"
					/>
				</div>

				<div className="flex flex-col items-center gap-2">
					<p className="text-text-secondary text-sm">With Icons</p>
					<SlideSwitch
						NodeTrue={<span className="flex items-center gap-2">☀️ Light</span>}
						NodeFalse={<span className="flex items-center gap-2">🌙 Dark</span>}
						leftIsTrue={true}
						value={isOn}
						onChange={setIsOn}
						className="w-56"
					/>
				</div>
			</div>
			<div className="mt-4 p-4 bg-background-paper rounded border border-divider">
				Current Value: <strong>{isOn ? 'TRUE' : 'FALSE'}</strong>
			</div>
		</div>
	);
}