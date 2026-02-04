"use client";

import React, { useState } from 'react';
import { FormControl, Radio, Input } from '@/stateless_ui/FormControls';
import ImageUploadUI from '@/stateless_ui/ImageUploadUI';
import { Plus, Trash2, Wand2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { upload } from './upload';

/**
 * 画像アップロード行の型
 */
type UploadRow = {
	id: string;
	direction: string;
	fileName?: string;
	previewUrl?: string;
};

/**
 * 3D生成ページ
 * ラジオボタンによる生成モードの切り替えと、動的な画像アップロードUIを提供します
 */
export default function Page() {
	const [mode, setMode] = useState<"image" | "text">("image");
	const [rows, setRows] = useState<UploadRow[]>([
		{ id: Math.random().toString(36).substr(2, 9), direction: "front" }
	]);
	const [prompt, setPrompt] = useState("");
	const [progress, setProgress] = useState(-1); // -1: 未開始, 0-99: 進行中, 100: 完了, 101+: エラー

	// 行を追加する (最大3つ)
	const addRow = () => {
		if (rows.length < 3) {
			setRows([...rows, { id: Math.random().toString(36).substr(2, 9), direction: "side" }]);
		}
	};

	// 行を削除する
	const removeRow = (id: string) => {
		if (rows.length > 1) {
			const target = rows.find(r => r.id === id);
			if (target?.previewUrl) {
				URL.revokeObjectURL(target.previewUrl);
			}
			setRows(rows.filter(row => row.id !== id));
		}
	};

	// ファイルがドロップされた時の処理
	const handleDrop = (id: string, files: File[]) => {
		if (files.length > 0) {
			const file = files[0];
			const previewUrl = URL.createObjectURL(file);
			setRows(rows.map(row => {
				if (row.id === id) {
					// 以前のURLがあれば解放
					if (row.previewUrl) URL.revokeObjectURL(row.previewUrl);
					return { ...row, fileName: file.name, previewUrl };
				}
				return row;
			}));
		}
	};

	// ファイルを削除する処理
	const handleRemoveFile = (id: string) => {
		setRows(rows.map(row => {
			if (row.id === id) {
				if (row.previewUrl) URL.revokeObjectURL(row.previewUrl);
				return { ...row, fileName: undefined, previewUrl: undefined };
			}
			return row;
		}));
	};

	return (
		<div className="max-w-2xl mx-auto space-y-10 py-8">
			<section className="space-y-4">
				<h1 className="text-3xl font-black text-text-primary tracking-tight">3Dモデルを生成</h1>
				<p className="text-text-secondary">画像や文章から、あなただけの3D寿司を生成します。</p>
			</section>

			{/* 生成モードの選択 */}
			<section className="p-6 bg-background-paper rounded-2xl border border-divider shadow-sm space-y-6">
				<FormControl label="生成モード">
					<div className="flex gap-6 mt-2">
						<Radio
							name="mode"
							checked={mode === "image"}
							onChange={() => setMode("image")}
							label="画像から生成"
						/>
						<Radio
							name="mode"
							checked={mode === "text"}
							onChange={() => setMode("text")}
							label="文章から生成"
						/>
					</div>
				</FormControl>

				{mode === "image" ? (
					<div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="space-y-4">
							<label className="text-sm font-medium text-text-primary">参考画像 (最大3枚)</label>
							{rows.map((row) => (
								<div key={row.id} className="flex gap-3 items-start group">
									<div className="flex-none w-32">
										<select
											value={row.direction}
											onChange={(e) => setRows(rows.map(r => r.id === row.id ? { ...r, direction: e.target.value } : r))}
											className="w-full h-11 rounded-md border border-divider bg-background-paper px-3 py-2 text-sm text-text-primary focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
										>
											<option value="front">正面</option>
											<option value="side">側面</option>
											<option value="top">上面</option>
											<option value="back">背面</option>
										</select>
									</div>
									<div className="flex-1">
										<ImageUploadUI
											fileName={row.fileName}
											previewUrl={row.previewUrl}
											onDrop={(files) => handleDrop(row.id, files)}
											onRemove={() => handleRemoveFile(row.id)}
										/>
									</div>
									{rows.length > 1 && (
										<button
											onClick={() => removeRow(row.id)}
											className="mt-2.5 p-2 text-text-secondary hover:text-error-main hover:bg-error-main/10 rounded-lg transition-colors"
										>
											<Trash2 size={20} />
										</button>
									)}
								</div>
							))}
						</div>

						{rows.length < 3 && (
							<button
								onClick={addRow}
								className="flex items-center gap-2 text-sm font-bold text-primary-main hover:bg-primary-main/5 px-4 py-2 rounded-lg transition-colors w-fit"
							>
								<Plus size={18} />
								画像を追加
							</button>
						)}
					</div>
				) : (
					<div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
						<FormControl label="プロンプト" helperText="例: 脂の乗った大トロが乗った、光り輝く寿司">
							<Input
								placeholder="生成したい寿司の特徴を入力してください"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								className="py-3 px-4 text-base"
							/>
						</FormControl>
					</div>
				)}
			</section>

			{/* 進捗表示 */}
			{progress >= 0 && (
				<div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
					<div className="flex justify-between items-center text-sm font-medium">
						<span className="text-text-secondary">
							{progress >= 101 ? 'エラーが発生しました' : progress === 100 ? '生成完了！' : '3D寿司を生成中...'}
						</span>
						<span className={progress >= 101 ? 'text-error-main' : 'text-primary-main'}>
							{progress <= 100 ? `${progress}%` : ''}
						</span>
					</div>
					<div className="h-3 w-full bg-background-paper rounded-full border border-divider overflow-hidden">
						<div
							className={`h-full transition-all duration-300 ${progress >= 101 ? 'bg-error-main' : 'bg-primary-main'}`}
							style={{ width: `${Math.min(progress, 100)}%` }}
						/>
					</div>
				</div>
			)}

			{/* 生成ボタン */}
			<div className="flex justify-center pt-4">
				<button
					className={`
						group flex items-center gap-3 px-12 py-4 rounded-full font-black text-xl shadow-lg transition-all
						${((mode === 'image' && rows.some(r => r.fileName)) || (mode === 'text' && prompt)) && progress < 0
							? 'bg-primary-main text-primary-contrast hover:scale-105 active:scale-95'
							: 'bg-action-disabledBackground text-text-disabled cursor-not-allowed'}
					`}
					disabled={!((mode === 'image' ? rows.some(r => r.fileName) : prompt) && progress < 0)}
					onClick={() => {
						// 画像ファイルがある行のみを抽出してファイルオブジェクトに変換
						const activeRows = rows.filter(r => r.previewUrl && r.fileName);
						const filePromises = activeRows.map(async (row) => {
							const res = await fetch(row.previewUrl!);
							const blob = await res.blob();
							return new File([blob], row.fileName || 'image.png', { type: blob.type });
						});

						Promise.all(filePromises).then(fileObjects => {
							// 画像モードの場合は各行の direction を views として渡す
							const views = activeRows.map(r => r.direction);

							upload(
								mode,
								mode === 'image' ? views : [],
								mode === 'image' ? fileObjects : [],
								prompt,
								setProgress
							);
						});
					}}
				>
					{progress >= 0 && progress < 100 ? (
						<Loader2 size={24} className="animate-spin" />
					) : progress >= 101 ? (
						<AlertCircle size={24} />
					) : progress === 100 ? (
						<CheckCircle2 size={24} />
					) : (
						<Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
					)}
					{progress >= 0 && progress < 100 ? '生成中...' : '3D寿司を生成する'}
				</button>
			</div>
		</div>
	);
}