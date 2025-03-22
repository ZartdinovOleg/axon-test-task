import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'normalize.css/normalize.css'
import { StoreProvider } from "@/redux/StoreProvider";
import { Suspense } from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Products list",
	description: "Products list",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<StoreProvider>
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable}`}>
					<Suspense>
						{children}
					</Suspense>
				</body>
			</html>
		</StoreProvider>
	);
}
