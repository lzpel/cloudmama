//- ログイン後のレイアウトを決定する
//- パソコンからの閲覧なら左にメニュー右にメインコンテンツ(props.children)
//- スマホからの閲覧ならメニューは下に配置、上にメインコンテンツ
//- メニューは「ふりかえり」「やるべきこと」「設定」の3つ
//ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止、またexport function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上のルールは保持し以降に内容を実装して

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { History, ListTodo, Settings, User, Moon, Smartphone, UserMinus } from 'lucide-react';

/**
 * ナビゲーション用アイテムの型定義
 */
type NavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
};

/**
 * メニュー項目のリスト
 */
const menuItems: NavItem[] = [
	{ label: "ふりかえり", href: "/history", icon: <History className="h-5 w-5" /> },
	{ label: "やるべきこと", href: "/tasks", icon: <ListTodo className="h-5 w-5" /> },
	{ label: "設定", href: "/settings", icon: <Settings className="h-5 w-5" /> },
];

/**
 * デスクトップ向けのサイドメニュー
 * 画面左側に固定され、プレミアムな質感を演出します。
 */
function SideMenu() {
	return (
		<aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-divider bg-background-paper p-6">
			{/* ロゴセクション */}
			<div className="mb-4">
				<Link href="/" className="text-xl font-black tracking-tighter text-text-primary whitespace-nowrap">
					AI <span className="text-primary-main uppercase">生活指導室</span>
				</Link>
			</div>

			{/* 睡眠・生活データスロット */}
			<div className="mb-8 space-y-1">
				{/* 睡眠時間リンク */}
				<Link
					href="/sleep"
					className="block p-4 rounded-2xl transition-all hover:bg-action-hover/5 group active:scale-[0.98]"
				>
					<div className="flex items-center gap-2 mb-1">
						<Moon className="h-3 w-3 text-primary-main" />
						<span className="text-[10px] font-black uppercase text-text-secondary tracking-widest group-hover:text-primary-main transition-colors">睡眠時間</span>
					</div>
					<div className="flex items-baseline gap-1">
						<span className="text-2xl font-black text-text-primary">7<span className="text-xs ml-0.5 opacity-50 font-medium">h</span> 24<span className="text-xs ml-0.5 opacity-50 font-medium">m</span></span>
					</div>
				</Link>

				{/* スマホ使用時間リンク */}
				<Link
					href="/phone"
					className="block p-4 rounded-2xl transition-all hover:bg-action-hover/5 group active:scale-[0.98]"
				>
					<div className="flex items-center gap-2 mb-1">
						<Smartphone className="h-3 w-3 text-primary-main" />
						<span className="text-[10px] font-black uppercase text-text-secondary tracking-widest group-hover:text-primary-main transition-colors">スマホ使用</span>
					</div>
					<div className="flex items-baseline gap-1">
						<span className="text-lg font-black text-text-primary">1<span className="text-xs ml-0.5 opacity-50 font-medium">h</span> 50<span className="text-xs ml-0.5 opacity-50 font-medium">m</span></span>
					</div>
				</Link>

				{/* 不在時間リンク */}
				<Link
					href="/away"
					className="block p-4 rounded-2xl transition-all hover:bg-action-hover/5 group active:scale-[0.98]"
				>
					<div className="flex items-center gap-2 mb-1">
						<UserMinus className="h-3 w-3 text-primary-main" />
						<span className="text-[10px] font-black uppercase text-text-secondary tracking-widest group-hover:text-primary-main transition-colors">不在時間</span>
					</div>
					<div className="flex items-baseline gap-1">
						<span className="text-lg font-black text-text-primary">6<span className="text-xs ml-0.5 opacity-50 font-medium">h</span> 10<span className="text-xs ml-0.5 opacity-50 font-medium">m</span></span>
					</div>
				</Link>
			</div>

			{/* ナビゲーションメニュー */}
			<nav className="flex-1 space-y-2">
				{menuItems.map(function (item: NavItem) {
					return (
						<Link
							key={item.href}
							href={item.href}
							className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-action-hover/10 hover:text-white group"
						>
							<span className="text-text-secondary group-hover:text-primary-main transition-colors">
								{item.icon}
							</span>
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* ユーザープロフィール簡易表示 */}
			<div className="pt-6 border-t border-divider">
				<button className="flex items-center gap-3 w-full rounded-xl px-2 py-2 text-left hover:bg-action-hover/5 transition-colors">
					<div className="h-10 w-10 rounded-full overflow-hidden border border-divider">
						<Image
							src="/usericon.png"
							alt="三角聡"
							width={40}
							height={40}
							className="object-cover w-full h-full"
						/>
					</div>
					<div>
						<p className="text-sm font-bold text-text-primary">三角聡</p>
						<p className="text-[10px] font-medium text-text-secondary">Premium Plan</p>
					</div>
				</button>
			</div>
		</aside>
	);
}

/**
 * モバイル向けのボトムナビゲーション
 * 画面下部に固定され、片手での操作を考慮したレイアウトです。
 */
function BottomNav() {
	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background-paper/80 backdrop-blur-xl border-t border-divider px-6">
			<div className="grid h-full grid-cols-3">
				{menuItems.map(function (item: NavItem) {
					return (
						<Link
							key={item.href}
							href={item.href}
							className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-text-secondary transition-colors hover:text-white"
						>
							<span className="mb-0.5">
								{item.icon}
							</span>
							{item.label}
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

/**
 * ログイン後アプリケーションの共通レイアウト
 * PCでは左サイドバー、スマホではボトムナビゲーションを提供します。
 */
export default function AppLayout(props: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen bg-background-default text-text-primary md:flex-row">
			{/* デスクトップ用メニュー */}
			<SideMenu />

			{/* メインコンテンツエリア */}
			<main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
				{/* モバイル用ヘッダー（必要に応じて表示） */}
				<header className="md:hidden flex h-14 items-center justify-between px-6 border-b border-divider bg-background-paper/50 backdrop-blur-md sticky top-0 z-40">
					<span className="text-sm font-black tracking-tighter text-text-primary">
						AI <span className="text-primary-main tracking-normal">生活指導室</span>
					</span>
					<div className="h-8 w-8 rounded-full bg-primary-main/10 flex items-center justify-center">
						<User className="h-4 w-4 text-primary-main" />
					</div>
				</header>

				{/* 子要素（各ページのコンテンツ） */}
				<div className="flex-1 p-4 md:p-8 overflow-y-auto">
					{props.children}
				</div>
			</main>

			{/* モバイル用メニュー */}
			<BottomNav />
		</div>
	);
}