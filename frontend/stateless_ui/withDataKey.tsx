import React from "react";

// クリックを追跡する情報を付加する関数とイベントから情報を取得する関数
type WithDataKeyType = {
	"data-key": string,
	value: string,
	'aria-controls': string,
};
export function GetDataKeyFromEvent(e: React.UIEvent){
	// 自分自身か親要素に value が付いている要素を遡って探す
	const target = e.target as HTMLElement;
	const elWithId = target.closest<HTMLElement>("[data-key]");
	return elWithId?.dataset.key;
}

// クリック情報を付加する高階コンポーネント
export function WithDataKey<P>(props: {children: React.ReactElement<P>, dataKey: string}): React.ReactElement<P & WithDataKeyType>{
	return withDataKey(props.children, props.dataKey)
}

// クリック情報を付加する
export function withDataKey<P>(
	element: React.ReactElement<P>,
	key: string
): React.ReactElement<P & WithDataKeyType> {
	const added: WithDataKeyType={
		"data-key": key,
		value: key,
		"aria-controls": key
	}
	return React.cloneElement(
		element as React.ReactElement<P & WithDataKeyType>,
		{
			...element.props,
			...added
		}
	);
}