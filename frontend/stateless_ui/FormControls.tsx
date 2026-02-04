//- 一行入力、ラジオボタン、コントロールをchildrenに入れてラベルを付ける部品をexport function
//共通ルール
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- stateless_ui/以下に配置されている部品はuseState/useEffect/useRefなどを禁止
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//- 以上の内容を改変しないこと

import React, { InputHTMLAttributes, ReactNode, Ref } from 'react';

type FormControlProps = {
	label: string;
	children: ReactNode;
	error?: string;
	helperText?: string;
	className?: string;
};

/**
 * ラベル、入力要素、エラー/ヘルプメッセージをまとめる Wrapper コンポーネント
 */
export function FormControl({
	label,
	children,
	error,
	helperText,
	className = "",
}: FormControlProps) {
	return (
		<div className={`flex flex-col gap-1.5 ${className}`}>
			<label className="text-sm font-medium text-text-primary">{label}</label>
			{children}
			{error && <p className="text-xs text-error-main">{error}</p>}
			{!error && helperText && (
				<p className="text-xs text-text-secondary">{helperText}</p>
			)}
		</div>
	);
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	ref?: Ref<HTMLInputElement>;
};

/**
 * テキスト入力コンポーネント (Input)
 */
export function Input({ className = "", ref, ...props }: InputProps) {
	return (
		<input
			ref={ref}
			className={[
				"block w-full rounded-md border border-divider bg-background-paper px-3 py-2 text-sm text-text-primary shadow-sm",
				"placeholder:text-text-secondary",
				"focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main",
				"disabled:cursor-not-allowed disabled:bg-action-disabledBackground disabled:text-text-disabled",
				className,
			].join(" ")}
			{...props}
		/>
	);
}

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	ref?: Ref<HTMLInputElement>;
};

/**
 * ラジオボタンコンポーネント
 */
export function Radio({ className = "", label, children, ref, ...props }: RadioProps) {
	const content = label || children;
	return (
		<label className="flex cursor-pointer items-center gap-2">
			<input
				ref={ref}
				type="radio"
				className={[
					"h-4 w-4 border-divider text-primary-main focus:ring-primary-main",
					"accent-primary-main",
					"disabled:cursor-not-allowed disabled:opacity-50",
					className,
				].join(" ")}
				{...props}
			/>
			{content && <span className="text-sm text-text-primary">{content}</span>}
		</label>
	);
}

/**
 * UI部品の一覧を確認するための Example コンポーネント
 */
export function Example() {
	return (
		<div className="space-y-8 p-6 bg-background-default border border-divider rounded-lg">
			<h2 className="text-xl font-bold text-text-primary">Form Controls Example</h2>

			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-text-primary">FormControl + Input</h3>

				{/* Standard Input */}
				<FormControl label="ユーザー名" helperText="表示名として公開されます">
					<Input placeholder="例: yamada_taro" />
				</FormControl>

				{/* Error State */}
				<FormControl label="メールアドレス" error="メールアドレスの形式が正しくありません">
					<Input placeholder="example@test.com" defaultValue="invalid-email" />
				</FormControl>

				{/* Disabled State */}
				<FormControl label="読み取り専用">
					<Input value="Disabled Value" disabled />
				</FormControl>
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-text-primary">Radio Buttons</h3>

				<FormControl label="通知設定">
					<div className="flex flex-col gap-2">
						<Radio name="notification" value="all" label="すべて受け取る" defaultChecked />
						<Radio name="notification" value="important" label="重要のみ受け取る" />
						<Radio name="notification" value="none" label="受け取らない" />
						<Radio name="notification" value="disabled" label="無効なオプション" disabled />
					</div>
				</FormControl>
			</div>
		</div>
	);
}