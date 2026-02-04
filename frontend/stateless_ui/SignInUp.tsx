/**
 * ログインおよびサインアップ用のUIコンポーネントを提供します。
 * Google アカウントでの認証、およびメール・パスワードによる認証の両方をサポートします。
 */

import React from 'react';

/**
 * Googleアイコン（SVG）
 * ブランドカラーを保持したアイコンコンポーネントです。
 */
function GoogleIcon() {
	return (
		<svg className="h-5 w-5" viewBox="0 0 24 24">
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}

/**
 * SignInUp コンポーネントのプロパティ
 */
type SignInUpProps = {
	/** 表示モード：'signin' (ログイン) または 'signup' (新規登録) */
	mode: "signin" | "signup";

	/** メール・パスワードフォームを表示するかどうか（デフォルト: true） */
	hasBasicForm?: boolean;

	/** カスタムタイトル（省略時はデフォルトのテキストを使用） */
	title?: string;

	/** カスタム説明文（省略時はデフォルトのテキストを使用） */
	description?: string;

	/** Googleログインボタンクリック時の処理。文字列の場合はそのURLへ遷移、関数の場合はその関数を実行 */
	onGoogleClick?: (() => void) | string;

	/** フォーム送信時の処理（メールアドレスとパスワードを引数に取る） */
	onSubmit?: (data: { email?: string; password?: string }) => void;

	/** モード切り替えリンクの遷移先URL */
	toggleLinkHref?: string;

	/** コンポーネント内に表示する追加のカスタム要素（メッセージなど） */
	children?: React.ReactNode;

	/** パスワードフィールドを非表示にするかどうか（マジックリンクのみの場合など） */
	hidePassword?: boolean;
};

/**
 * ログイン/サインアップ画面コンポーネント
 * グラスモーフィズムを採用し、背景の上に重ねて美しく表示されるように設計されています。
 */
export default function SignInUp(props: SignInUpProps) {
	const isSignIn = props.mode === "signin";
	const hasForm = props.hasBasicForm ?? true;
	const hidePassword = props.hidePassword ?? false;

	const defaultTitle = isSignIn ? "おかえりなさい" : "ようこそ";
	const defaultDesc = isSignIn
		? "アカウントにログインして、作業を再開しましょう。"
		: "新しくアカウントを作成して、体験を始めましょう。";

	const toggleText = isSignIn
		? "アカウントをお持ちでない場合は"
		: "すでにアカウントをお持ちですか？";
	const toggleLinkText = isSignIn ? "新規登録" : "ログイン";

	const toggleLinkHref = props.toggleLinkHref || "#";

	/**
	 * フォーム送信時の処理
	 * デフォルトの動作をキャンセルし、props.onSubmit を呼び出します。
	 */
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		props.onSubmit?.({ email, password });
	};

	return (
		<div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-white/15 dark:bg-black/20 dark:hover:bg-black/25">
			{/* ヘッダーセクション */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-3xl font-bold tracking-tight text-white drop-shadow-sm">
					{props.title || defaultTitle}
				</h1>
				<p className="text-sm text-white/70">
					{props.description || defaultDesc}
				</p>
			</div>

			{/* 追加コンテンツ（通知メッセージなど） */}
			{props.children && (
				<div className="mb-8">
					{props.children}
				</div>
			)}

			{/* Google 連携ボタン */}
			<div className="mb-8">
				{typeof props.onGoogleClick === "string" ? (
					<a
						href={props.onGoogleClick}
						className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
					>
						<GoogleIcon />
						<span>Google で続行</span>
					</a>
				) : (
					<button
						type="button"
						onClick={props.onGoogleClick as any}
						className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
					>
						<GoogleIcon />
						<span>Google で続行</span>
					</button>
				)}
			</div>

			{/* 区切り線 */}
			{hasForm && (
				<>
					<div className="relative mb-8">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-white/20"></div>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-transparent px-3 text-white/50 backdrop-blur-sm">
								または
							</span>
						</div>
					</div>

					{/* メール認証フォーム */}
					<form onSubmit={handleSubmit}>
						<div className="space-y-5">
							<div className="space-y-2">
								<label className="text-sm font-medium text-white/90 ml-1">メールアドレス</label>
								<input
									name="email"
									type="email"
									placeholder="name@example.com"
									required
									className="block w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
								/>
							</div>

							{isSignIn && !hidePassword && (
								<div className="space-y-2">
									<label className="text-sm font-medium text-white/90 ml-1">パスワード</label>
									<input
										name="password"
										type="password"
										required
										className="block w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
									/>
								</div>
							)}

							<button
								type="submit"
								className="mt-2 w-full rounded-xl bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.98]"
							>
								{isSignIn ? "ログイン" : "無料でアカウント作成"}
							</button>
						</div>
					</form>
				</>
			)}

			{/* フッターリンク（切り替えリンク） */}
			<div className="mt-8 text-center text-sm">
				<span className="text-white/60">{toggleText} </span>
				<a
					href={toggleLinkHref}
					className="font-semibold text-white hover:text-white/80 hover:underline transition-colors"
				>
					{toggleLinkText}
				</a>
			</div>
		</div>
	);
}

/**
 * 各種パターンのプレビューを表示するためのコンポーネント
 * 開発中のUI確認に使用します。
 */
export function Example() {
	return (
		<div className="grid gap-12 p-12 bg-gray-950 min-h-screen lg:grid-cols-2 lg:items-start">
			<div className="space-y-4">
				<p className="text-white/40 text-xs font-mono uppercase tracking-widest text-center">Standard SignIn</p>
				<SignInUp
					mode="signin"
					onSubmit={(data) => console.log("SignIn:", data)}
					toggleLinkHref="#"
				/>
			</div>

			<div className="space-y-4">
				<p className="text-white/40 text-xs font-mono uppercase tracking-widest text-center">Magic Link Mode</p>
				<SignInUp
					mode="signin"
					onSubmit={(data) => console.log("MagicLink:", data)}
					toggleLinkHref="#"
					hidePassword={true}
					description="パスワード不要。メールのみでログインできます。"
				/>
			</div>

			<div className="space-y-4">
				<p className="text-white/40 text-xs font-mono uppercase tracking-widest text-center">Standard SignUp</p>
				<SignInUp
					mode="signup"
					onSubmit={(data) => console.log("SignUp:", data)}
					toggleLinkHref="#"
				>
					<div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 p-4 rounded-xl text-xs leading-relaxed">
						アカウントを作成することで、利用規約およびプライバシーポリシーに同意したものとみなされます。
					</div>
				</SignInUp>
			</div>

			<div className="space-y-4">
				<p className="text-white/40 text-xs font-mono uppercase tracking-widest text-center">Google Only</p>
				<SignInUp
					mode="signin"
					hasBasicForm={false}
					onGoogleClick="/auth/google"
					toggleLinkHref="#"
					title="シームレスなログイン"
					description="ワンクリックでお気に入りの環境へ。"
				/>
			</div>
		</div>
	);
}
