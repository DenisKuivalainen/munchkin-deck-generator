import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Munchkin deck generator",
  description: "Munchkin deck generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
