//- props.redirect_url先にリダイレクトする、外観は無い
//- import { useEffect } from "react"; import { useRouter } from "next/navigation";を使う
//共通ルール：全体
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//共通ルール：stateless_ui/以下
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type RedirectProps = {
	target: string;
};

/**
 * クライアントサイドリダイレクトを行うコンポーネント
 */
export default function Redirect(props: RedirectProps) {
	const router = useRouter();

	useEffect(() => {
		router.push(props.target);
	}, [router, props.target]);

	return null;
}