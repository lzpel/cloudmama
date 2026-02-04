import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/globals.css";
import Provider from "@/app/Provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Sarod",
	description: "AI agent for everyone",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	// 例: viewportFit: "cover", などもここ
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="jp">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Provider>
					{children}
				</Provider>
			</body>
		</html>
	);
}
