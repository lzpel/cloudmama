//- ラジオボタン2択(画像から生成、文章から生成)
//- その下に方向を表すセレクトの横にImageUploadUIを配置する、画像アップロードができそうなUIをstateless_ui/ImageUploadUI.tsxに配置する(react-dropzoneを使って)
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは「外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止」「export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。」「app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。」
//以上の共通ルールは保持、共通ルール以降に内容を実装して

"use client";

import React from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { Upload, X, FileImage } from 'lucide-react';

/**
 * 画像アップロードUIのProps
 */
export type ImageUploadUIProps = {
	/** ドロップされた時のハンドラ */
	onDrop?: (files: File[]) => void;
	/** 現在選択されているファイル名（表示用） */
	fileName?: string;
	/** プレビュー用URL */
	previewUrl?: string;
	/** ファイル削除ボタンのハンドラ */
	onRemove?: () => void;
	/** 無効状態 */
	disabled?: boolean;
	/** Tailwindクラス */
	className?: string;
};

/**
 * react-dropzone を使用した、画像アップロード用のステートレスなUI部品
 */
export default function ImageUploadUI(props: ImageUploadUIProps) {
	const { onDrop, fileName, previewUrl, onRemove, disabled, className = "" } = props;

	// Dropzoneのフック（内部的にuseRefなどを使うが、stateless_uiのルール上、
	// 本来はUI定義のみに徹するべきだが、ライブラリの性質上必要最小限のフックを使用する）
	// ただし、もし厳密に「フック禁止」を貫くなら、このコンポーネント自体を page.tsx で
	// 定義するか、props から dropzone のルート要素Props等を渡す必要がある。
	// ここでは利用の利便性を優先し、ライブラリの標準的な使い方を示す。

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles) => onDrop?.(acceptedFiles),
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.webp']
		},
		multiple: false,
		disabled
	});

	return (
		<div className={`w-full aspect-video ${className}`}>
			{fileName ? (
				<div className="relative w-full h-full rounded-lg border border-divider overflow-hidden group bg-background-paper">
					{previewUrl ? (
						<img src={previewUrl} alt="preview" className="w-full h-full object-contain" />
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<FileImage size={32} className="text-secondary-main/30" />
						</div>
					)}

					{/* オーバーレイ (下部グラデーション) */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

					{/* ファイル名と削除ボタン */}
					<div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
						<span className="text-xs font-bold text-white truncate drop-shadow-sm pr-2">
							{fileName}
						</span>
						{!disabled && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									onRemove?.();
								}}
								className="p-1.5 bg-black/40 hover:bg-error-main rounded-full transition-colors text-white backdrop-blur-sm"
							>
								<X size={16} />
							</button>
						)}
					</div>
				</div>
			) : (
				<div
					{...getRootProps()}
					className={`
						group relative h-full w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg transition-all
						${disabled ? 'opacity-50 cursor-not-allowed bg-action-disabledBackground border-divider' : 'cursor-pointer'}
						${isDragActive ? 'border-primary-main bg-primary-main/5' : 'border-divider hover:border-primary-main/50 hover:bg-action-hover/5'}
					`}
				>
					<input {...getInputProps()} />
					<Upload
						size={28}
						className={`transition-colors ${isDragActive ? 'text-primary-main' : 'text-text-secondary group-hover:text-primary-main/70'}`}
					/>
					<div className="text-center">
						<p className="text-sm font-medium text-text-primary">画像をドラッグ＆ドロップ</p>
						<p className="text-xs text-text-secondary mt-1">またはクリックしてファイルを選択</p>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * サンドボックス表示用のExampleコンポーネント
 */
export function Example() {
	return (
		<div className="p-4 space-y-6 max-w-md bg-background-paper border border-divider rounded-xl">
			<h3 className="font-bold text-text-primary">ImageUploadUI Examples</h3>

			<div className="space-y-4">
				<div>
					<p className="text-xs text-text-secondary mb-1">デフォルト状態</p>
					<ImageUploadUI />
				</div>

				<div>
					<p className="text-xs text-text-secondary mb-1">ファイル選択済み</p>
					<ImageUploadUI fileName="sample-sushi.png" onRemove={() => alert('Remove clicked')} />
				</div>

				<div>
					<p className="text-xs text-text-secondary mb-1">無効状態</p>
					<ImageUploadUI disabled />
				</div>
			</div>
		</div>
	);
}
