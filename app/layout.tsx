import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react"; // useEffect 임포트

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Hayansool Content Manager",
    description: "Custom Makgeolli 101 content management system",
    generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker
                    .register("/serviceWorker (1).js") 
                    .then(function (registration) {
                        console.log("ServiceWorker registration successful with scope: ", registration.scope);
                    })
                    .catch(function (err) {
                        console.log("ServiceWorker registration failed: ", err);
                    });
            });
        }
    }, []); 
    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest (1).json" />
            </head>
            <body className={inter.className}>
                <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">{children}</div>
            </body>
        </html>
    );
}
