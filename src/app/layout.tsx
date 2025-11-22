import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { AuthProvider } from "@/context/AuthContext";
import { FileText, Users, Settings, LogIn } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Invoice Platform',
  description: 'Manage your invoices with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 glow-red-sm">
              <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="group relative">
                    <span className="font-orbitron text-4xl font-black tracking-wider bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent group-hover:from-red-500 group-hover:via-red-400 group-hover:to-red-300 transition-all duration-300 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(239,68,68,0.7)]">
                      INVOICE
                    </span>
                  </Link>
                  <div className="flex items-center gap-6">
                    <Link href="/invoices" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                      <FileText className="w-4 h-4" />
                      Invoices
                    </Link>
                    <Link href="/clients" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                      <Users className="w-4 h-4" />
                      Clients
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <ThemeToggle />
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-red-sm">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  </div>
                </div>
              </nav>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-6 mt-auto">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 InvoiceApp. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
