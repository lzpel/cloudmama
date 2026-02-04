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
