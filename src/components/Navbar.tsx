import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          InvoiceGen
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/invoices" className="text-white hover:text-gray-300">
              Invoices
            </Link>
          </li>
          <li>
            <Link href="/clients" className="text-white hover:text-gray-300">
              Clients
            </Link>
          </li>
          <li>
            <Link href="/settings" className="text-white hover:text-gray-300">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}