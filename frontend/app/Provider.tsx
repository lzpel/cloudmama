// app/providers.tsx など
"use client";

import { AuthProvider, useAuth } from "@/src/AuthProvider";
import * as api from "@/src/out";
import { NuqsAdapter } from "nuqs/adapters/react";

export type User=api.User;
export const useUser=useAuth<User>;
export default function Provider({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider<User>
			fetchUser={async () => {
				const res = await api.userApiUserGet();
				return res.data;
			}}
			initialUser={null}
		>
			<NuqsAdapter>
				{children}
			</NuqsAdapter>
		</AuthProvider>
	);
}