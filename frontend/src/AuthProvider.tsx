// src/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthContextValue<User> = {
	user: User | null;
	loading: boolean;
	reload: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue<unknown> | undefined>(undefined);

export function AuthProvider<User>(props: {
	children: React.ReactNode;
	fetchUser: () => Promise<User>; // ← 注入
	initialUser?: User | null;
}) {
	const [User, setUser] = useState<User | null>(props.initialUser ?? null);
	const [loading, setLoading] = useState(true);

	const reload = useMemo(
		() => async () => {
			props.fetchUser().then((v) => {
				setUser(v);
				setLoading(false);
			}).catch((e) => {
				setUser(null);
				setLoading(false);
			})
		},
		[props.fetchUser]
	);

	useEffect(() => {
		void reload();
	}, [reload]);

	return (
		<AuthContext.Provider value={{ user: User, loading, reload } as AuthContextValue<User>}>
			{props.children}
		</AuthContext.Provider>
	);
}

export function useAuth<User>() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
	return ctx as AuthContextValue<User>;
}