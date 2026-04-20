import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Registry System",
    description: "Add a shadcn-compatible component registry to any Next.js project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen">
        <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
            <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="font-bold text-lg tracking-tight">
                registry-system
            </a>
            <nav className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
                <a href="https://github.com/phucbm/registry-system" target="_blank" rel="noreferrer"
                   className="hover:text-[var(--foreground)] transition-colors">
                    GitHub
                </a>
                <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/components/hello-world`}
                   className="hover:text-[var(--foreground)] transition-colors">
                    Demo
                </a>
            </nav>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-12">
            {children}
        </main>
        </body>
        </html>
    );
}
