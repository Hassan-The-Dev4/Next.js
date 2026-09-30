import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Todo app built with Next.js Server Actions and MongoDB",
};

export default function TodoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-gray-100 py-1">{children}</div>;
}
