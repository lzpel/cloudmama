"use client";

import React from "react";
import { PlanSelectionUI } from "@/stateless_ui/PlanSelectionUI";
import { userApiUserGet, userApiUserPayPlan, type User } from "@/src/out";

/**
 * ブラン選択ページ
 * ユーザーが現在のプランを確認し、必要に応じてアップグレードできるページです。
 */
export default function PlanPage() {
	const [userData, setUserData] = React.useState<User | null>(null);
	const [loading, setLoading] = React.useState(true);

	// 初期表示時にユーザーデータを取得する
	React.useEffect(() => {
		userApiUserGet()
			.then((res) => {
				setUserData(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch user data:", err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	/**
	 * Unlimitedプランを選択（アップグレード）した際のハンドラ
	 */
	const handleSelectUnlimited = async () => {
		await userApiUserPayPlan(1).then((res) => {
			window.location.href = res.data;
		}).catch((err) => {
			console.error("Failed to get payment URL:", err);
			alert("支払いページの取得に失敗しました。時間をおいて再度お試しください。");
		});
	};

	/**
	 * プランを解約する際のハンドラ
	 */
	const handleCancel = () => {
		// 現時点では解約APIが未実装のようなので、アラートのみ
		alert("解約機能は現在準備中です。カスタマーサポートまでお問い合わせください。");
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background-default flex items-center justify-center">
				<div className="animate-spin h-10 w-10 border-4 border-primary-main border-t-transparent rounded-full"></div>
			</div>
		);
	}

	// pay_subscription が空文字でない場合は「有効」と判定する
	const isActivated = !!userData?.pay_subscription && userData.pay_subscription !== "";

	return (
		<div className="min-h-screen bg-background-default">
			<PlanSelectionUI
				is_activated={isActivated}
				onSelectUnlimited={handleSelectUnlimited}
				onCancel={handleCancel}
			/>
		</div>
	);
}
