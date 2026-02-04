import { authApiS3url, pageApiPush } from "@/src/out";

/**
 * 3D寿司生成のためのアップロードプロセスを管理する関数 (並列処理版)
 */
export function upload(
	mode: "image" | "text",
	views: string[],
	files: File[],
	prompt: string,
	setProgress: (progress: number) => void,
) {
	// アップロード開始
	setProgress(0);

	// テキストモードまたはファイルなしの場合は直接プッシュへ
	if (mode === "text" || files.length === 0) {
		setProgress(80);
		pageApiPush({
			path_image: [],
			view_image: [],
			script: prompt
		})
			.then((pushRes) => {
				if (!pushRes.data) throw new Error("Failed to push page data");
				setProgress(100);
			})
			.catch((error) => {
				console.error("Upload failed:", error);
				setProgress(101);
			});
		return;
	}

	let completedCount = 0;

	// 各ファイルに対する並列アップロードPromiseの配列
	// Promise.all は元の配列の順序を維持します
	const uploadPromises = files.map((file) => {
		return authApiS3url({
			fileName: file.name,
			expiresIn: 3600
		})
			.then((uploadRes) => {
				const signedUrl = uploadRes.data;
				if (!signedUrl || !signedUrl[1]) {
					throw new Error(`Failed to get signed URL for ${file.name}`);
				}

				// S3へ直接PUTアップロード
				return fetch(signedUrl[1], {
					method: "PUT",
					body: file,
					headers: {
						"Content-Type": file.type
					}
				}).then((putRes) => {
					if (!putRes.ok) {
						throw new Error(`Failed to upload ${file.name} to S3: ${putRes.statusText}`);
					}

					// 完了数をカウントして進捗を更新
					completedCount++;
					setProgress(Math.floor((completedCount / files.length) * 80));

					// S3上のユニークなパスを返す
					return signedUrl[0];
				});
			});
	});

	// すべてのアップロードを並列に待機
	Promise.all(uploadPromises)
		.then((paths) => {
			// 最終的なメタ情報のプッシュ
			// paths と views はインデックスが 1:1 で対応しています
			setProgress(90);
			return pageApiPush({
				path_image: paths,
				view_image: views,
				script: prompt
			});
		})
		.then((pushRes) => {
			if (!pushRes.data) {
				throw new Error("Failed to push page data");
			}
			// 全行程完了
			setProgress(100);
		})
		.catch((error) => {
			console.error("Upload failed:", error);
			// エラー状態
			setProgress(101);
		});
}
