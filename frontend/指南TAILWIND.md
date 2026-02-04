# tailwindcssの導入(v4)

https://tailwindcss.com/docs/installation/using-postcss

npm install @tailwindcss/postcss tailwindcss # postcss はnextjsに同封されているので不要

# postcss.config.mjsの作成

```postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

# paletteのclassを定義

```
/** @type {import('tailwindcss').Config} */
// material ui風のpaletteを導入
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			/**
			 * 重要:
			 * - CSS変数は `R G B` (例: "25 118 210") の形式で持つ想定
			 * - Tailwind側は `rgb(var(--...)/<alpha-value>)` を参照
			 *
			 * 例: --palette-primary-main: 25 118 210;
			 */
			colors: {
				// ===== Tone (primary/secondary/...) =====
				primary: {
					main: "rgb(var(--palette-primary-main) / <alpha-value>)",
					contrast: "rgb(var(--palette-primary-contrastText) / <alpha-value>)",
					light: "rgb(var(--palette-primary-light) / <alpha-value>)",
					dark: "rgb(var(--palette-primary-dark) / <alpha-value>)",
				},
				secondary: {
					main: "rgb(var(--palette-secondary-main) / <alpha-value>)",
					contrast: "rgb(var(--palette-secondary-contrastText) / <alpha-value>)",
					light: "rgb(var(--palette-secondary-light) / <alpha-value>)",
					dark: "rgb(var(--palette-secondary-dark) / <alpha-value>)",
				},
				error: {
					main: "rgb(var(--palette-error-main) / <alpha-value>)",
					contrast: "rgb(var(--palette-error-contrastText) / <alpha-value>)",
					light: "rgb(var(--palette-error-light) / <alpha-value>)",
					dark: "rgb(var(--palette-error-dark) / <alpha-value>)",
				},
				warning: {
					main: "rgb(var(--palette-warning-main) / <alpha-value>)",
					contrast: "rgb(var(--palette-warning-contrastText) / <alpha-value>)",
					light: "rgb(var(--palette-warning-light) / <alpha-value>)",
					dark: "rgb(var(--palette-warning-dark) / <alpha-value>)",
				},
				info: {
					main: "rgb(var(--palette-info-main) / <alpha-value>)",
					contrast: "rgb(var(--palette-info-contrastText) / <alpha-value>)",
					light: "rgb(var(--palette-info-light) / <alpha-value>)",
					dark: "rgb(var(--palette-info-dark) / <alpha-value>)",
				},
				success: {
					main: "rgb(var(--palette-success-main) / <alpha-value>)",
					contrast: "rgb(var(--palette-success-contrastText) / <alpha-value>)",
					light: "rgb(var(--palette-success-light) / <alpha-value>)",
					dark: "rgb(var(--palette-success-dark) / <alpha-value>)",
				},

				// ===== text/background/divider/action =====
				text: {
					primary: "rgb(var(--palette-text-primary) / <alpha-value>)",
					secondary: "rgb(var(--palette-text-secondary) / <alpha-value>)",
					disabled: "rgb(var(--palette-text-disabled) / <alpha-value>)",
				},
				background: {
					default: "rgb(var(--palette-background-default) / <alpha-value>)",
					paper: "rgb(var(--palette-background-paper) / <alpha-value>)",
				},
				divider: "rgb(var(--palette-divider) / <alpha-value>)",
				action: {
					hover: "rgb(var(--palette-action-hover) / <alpha-value>)",
					selected: "rgb(var(--palette-action-selected) / <alpha-value>)",
					disabled: "rgb(var(--palette-action-disabled) / <alpha-value>)",
					disabledBackground:
						"rgb(var(--palette-action-disabledBackground) / <alpha-value>)",
					focus: "rgb(var(--palette-action-focus) / <alpha-value>)",
				},
			},
		},
	},
	darkMode: ["class"], // palette.mode と合わせるなら class 運用が安定
	plugins: [],
};
```

## フロントエンド部品の作り方

stateless_ui/以下にフロントエンド部品を配置する

```FormControls.tsx
//- 一行入力、ラジオボタン、コントロールをchildrenに入れてラベルを付ける部品をexport function
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//stateless_ui/以下のTsxに適用するルール
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して
```

AIに指示
> frontend\stateless_ui\FormControls.tsxの共通ルール以降に内容を実装して