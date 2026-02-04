//- background.jpgを背景に、SignInUpコンポーネントを中央に配置
//- グラスモーフィズムなデザインでプレミアム感を演出
//ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止、またexport function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上のルールは保持し以降に内容を実装して

'use client';

import React from 'react';
import SignInUp from '@/stateless_ui/SignInUp';

/**
 * ログインページのルートコンポーネント
 * 美しい背景画像とグラスモーフィズムを用いたサインイン画面を表示します。
 */
export default function SignInPage() {
	/**
	 * フォーム送信時の処理
	 * @param data ログイン情報（メールアドレス、パスワード）
	 */
	function handleSignIn(data: { email?: string; password?: string }) {
		console.log("Sign in attempted:", data);
		// 実際の認証ロジックはバックエンド連携時に実装
	}

	/**
	 * Googleログインボタンがクリックされた時の処理
	 */
	function handleGoogleSignIn() {
		console.log("Google Sign-In initiated");
		// Google認証フローへリダイレクトまたはポップアップ
	}

	return (
		<main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background-default">
			{/* 背景レイヤー: background.jpg を全画面に広げ、プレミアムな質感を演出 */}
			<div
				className="absolute inset-0 z-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105"
				aria-hidden="true"
			>
				{/* 視認性を高め、プレミアムな深みを出すための多層オーバーレイ */}
				<div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
				<div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-black/40" />
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
			</div>

			{/* コンテンツレイヤー: SignInUpコンポーネントを中央に配置 */}
			<div className="relative z-10 flex w-full items-center justify-center px-4 py-20">
				<div className="w-full max-w-md transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
					<SignInUp
						mode="signin"
						onGoogleClick={handleGoogleSignIn}
						onSubmit={handleSignIn}
						toggleLinkHref="/signup"
					/>
				</div>
			</div>

			{/* 装飾的なライティングエフェクト: 画面の隅に微かな光を配置してプレミアム感を演出 */}
			<div className="absolute top-[-10%] left-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-primary-main/10 blur-[120px]" />
			<div className="absolute bottom-[-10%] right-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-secondary-main/20 blur-[120px]" />
		</main>
	);
}
