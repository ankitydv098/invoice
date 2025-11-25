import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Invoice Platform',
  description: 'Manage your invoices with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-300 hover:text-blue-100 transition-colors duration-200">
              InvoiceApp
            </Link>
            <div className="space-x-4">
              <Link href="/invoices" className="text-lg hover:text-blue-300 transition-colors duration-200">
                Invoices
              </Link>
              <Link href="/clients" className="text-lg hover:text-blue-300 transition-colors duration-200">
                Clients
              </Link>
              <Link href="/settings" className="text-lg hover:text-blue-300 transition-colors duration-200">
                Settings
              </Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="bg-gray-800 text-white p-4 text-center mt-8 shadow-inner">
          <p>&copy; 2024 InvoiceApp. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
