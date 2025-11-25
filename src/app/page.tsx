"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">InvoiceApp</span>
        </h1>

        <p className="mt-3 text-2xl text-gray-600">
          Your ultimate solution for managing invoices efficiently.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link
            href="/invoices"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600 transition-colors border-gray-300 hover:border-blue-500"
          >
            <h3 className="text-2xl font-bold">Manage Invoices &rarr;</h3>
            <p className="mt-4 text-xl">
              Create, view, edit, and delete your invoices.
            </p>
          </Link>

          <Link
            href="/clients"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600 transition-colors border-gray-300 hover:border-blue-500"
          >
            <h3 className="text-2xl font-bold">Manage Clients &rarr;</h3>
            <p className="mt-4 text-xl">
              Keep track of all your client information.
            </p>
          </Link>

          <Link
            href="/settings"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600 transition-colors border-gray-300 hover:border-blue-500"
          >
            <h3 className="text-2xl font-bold">Settings &rarr;</h3>
            <p className="mt-4 text-xl">
              Configure your application settings.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
