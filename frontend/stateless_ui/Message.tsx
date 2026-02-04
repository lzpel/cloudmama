//- メッセージをユーザーに示す部品、左にアイコン、右にテキストで角丸の境界線と囲まれている
//- 境界線に対して領域は薄い色を使用、アイコンと色はtailwind.config.jsのcolorsを参照
//共通ルール：全体
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//共通ルール：stateless_ui/以下
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して

import React, { ReactNode } from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

type Variant = 'info' | 'success' | 'warning' | 'error';

type MessageProps = {
	children: ReactNode;
	variant?: Variant;
	title?: string;
	icon?: ReactNode;
	className?: string;
};

/**
 * ユーザー向けメッセージ表示コンポーネント
 */
export function Message(props: MessageProps) {
	const variant = props.variant || 'info';

	const styles = {
		info: {
			wrapper: "bg-info-main/10 border-info-main/20",
			icon: "text-info-main",
			title: "text-text-primary",
		},
		success: {
			wrapper: "bg-success-main/10 border-success-main/20",
			icon: "text-success-main",
			title: "text-text-primary",
		},
		warning: {
			wrapper: "bg-warning-main/10 border-warning-main/20",
			icon: "text-warning-main",
			title: "text-text-primary",
		},
		error: {
			wrapper: "bg-error-main/10 border-error-main/20",
			icon: "text-error-main",
			title: "text-text-primary",
		},
	};

	const currentStyle = styles[variant];

	// Default icons if not provided
	let iconNode = props.icon;
	if (!iconNode) {
		switch (variant) {
			case 'success': iconNode = <CheckCircle className="h-5 w-5" />; break;
			case 'warning': iconNode = <AlertTriangle className="h-5 w-5" />; break;
			case 'error': iconNode = <AlertCircle className="h-5 w-5" />; break;
			default: iconNode = <Info className="h-5 w-5" />; break; // info
		}
	}

	return (
		<div className={`flex items-start gap-3 rounded-lg border p-4 ${currentStyle.wrapper} ${props.className || ""}`}>
			<div className={`flex-shrink-0 pt-0.5 ${currentStyle.icon}`}>
				{iconNode}
			</div>
			<div className="flex-1 space-y-1">
				{props.title && (
					<h3 className={`font-medium leading-none tracking-tight ${currentStyle.title}`}>
						{props.title}
					</h3>
				)}
				<div className="text-sm text-text-secondary">
					{props.children}
				</div>
			</div>
		</div>
	);
}

/**
 * Example component
 */
export function Example() {
	return (
		<div className="space-y-4 p-4 bg-background-paper rounded border border-divider">
			<h2 className="text-lg font-bold text-text-primary">Message Component Examples</h2>

			<Message variant="info" title="Information">
				これは情報のメッセージです。ユーザーに通知する際に使用します。
			</Message>

			<Message variant="success" title="Success">
				操作が正常に完了しました。おめでとうございます。
			</Message>

			<Message variant="warning" title="Warning">
				注意が必要です。この操作は取り消せない可能性があります。
			</Message>

			<Message variant="error" title="Error">
				エラーが発生しました。もう一度お試しください。
			</Message>

			<Message variant="info">
				タイトルなしのシンプルなメッセージ表示も可能です。
			</Message>
		</div>
	);
}