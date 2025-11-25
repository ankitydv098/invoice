"use client";

import React, { useState, useEffect } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import EditInvoiceForm from '@/components/EditInvoiceForm';
import dynamic from 'next/dynamic';
const InvoicePDFViewer = dynamic(() => import('@/components/InvoicePDFViewer'), { ssr: false });
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'paid';
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [searchQuery, setSearchQuery] = useState(''); // Add search query state

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices?search=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInvoices(data);
        } else {
          console.error('API returned non-array data:', data);
          setInvoices([]);
        }
      } else {
        console.error('Failed to fetch invoices:', res.statusText);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };

  const handleInvoiceCreated = () => {
    setShowCreateForm(false);
    fetchInvoices();
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  const handleInvoiceUpdated = () => {
    setEditingInvoice(null);
    fetchInvoices();
  };

  const handleDeleteInvoice = async (id: string) => {
    await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
    fetchInvoices();
  };

  const generatePdf = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.text(`Invoice ID: ${invoice.id}`, 10, 10);
    doc.text(`Client Name: ${invoice.clientName}`, 10, 20);
    doc.text(`Amount: $${invoice.amount.toFixed(2)}`, 10, 30);
    doc.text(`Status: ${invoice.status}`, 10, 40);
    return doc.output('datauristring');
  };

  const handleViewPdf = (invoice: Invoice) => {
    const pdfData = generatePdf(invoice);
    setViewingPdf(pdfData);
  };

  const handleDownloadPdf = (invoice: Invoice) => {
    const pdfDataUri = generatePdf(invoice);
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = `invoice-${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Invoice
        </button>
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
            <InvoiceForm onSuccess={handleInvoiceCreated} onCancel={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}

      {editingInvoice && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Invoice</h2>
            <EditInvoiceForm invoice={editingInvoice} onSuccess={handleInvoiceUpdated} onCancel={() => setEditingInvoice(null)} />
          </div>
        </div>
      )}

      {viewingPdf && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl h-5/6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Invoice PDF</h2>
            <InvoicePDFViewer pdfData={viewingPdf} />
            <button
              onClick={() => setViewingPdf(null)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Close PDF
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No invoices found. Create a new one!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{invoice.clientName}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">${invoice.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${invoice.status === 'pending' ? 'text-yellow-900' : 'text-green-900'}`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 ${invoice.status === 'pending' ? 'bg-yellow-200' : 'bg-green-200'} opacity-50 rounded-full`}
                      ></span>
                      <span className="relative">{invoice.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleEditInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewPdf(invoice)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(invoice)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}