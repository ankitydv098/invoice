"use client";

import React, { useState, useEffect } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import dynamic from 'next/dynamic';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Download, Eye, Edit, Trash2, Loader2, FileText } from 'lucide-react';

const InvoicePDFViewer = dynamic(() => import('@/components/InvoicePDFViewer'), { ssr: false });

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'paid';
  dueDate?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('₹'); // Default to INR
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Load currency setting
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('invoiceSettings');
        if (saved) {
          const settings = JSON.parse(saved);
          const currencyMap: Record<string, string> = {
            'INR': '₹',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
          };
          const currencySymbol = currencyMap[settings.currency] || '₹';
          setCurrency(currencySymbol);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    loadSettings();

    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchInvoices();
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const fetchInvoices = async () => {
    setLoading(true);
    const res = await fetch(`/api/invoices?search=${searchQuery}`);
    const data = await res.json();
    setInvoices(data);
    setLoading(false);
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
    if (confirm('Are you sure you want to delete this invoice?')) {
      await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });
      fetchInvoices();
    }
  };

  const generatePdf = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.text(`Invoice ID: ${invoice.id}`, 10, 10);
    doc.text(`Client Name: ${invoice.clientName}`, 10, 20);
    doc.text(`Amount: ${currency}${invoice.amount.toFixed(2)}`, 10, 30);
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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Invoices</h1>
          <p className="text-muted-foreground">Manage and track all your invoices</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search invoices by client name or status..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new invoice
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm onSuccess={handleInvoiceCreated} onCancel={() => setShowCreateForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={!!editingInvoice} onOpenChange={(open) => !open && setEditingInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update the invoice details
            </DialogDescription>
          </DialogHeader>
          {editingInvoice && (
            <InvoiceForm
              initialData={editingInvoice}
              onSuccess={handleInvoiceUpdated}
              onCancel={() => setEditingInvoice(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingPdf} onOpenChange={(open) => !open && setViewingPdf(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Invoice PDF Preview</DialogTitle>
          </DialogHeader>
          {viewingPdf && <InvoicePDFViewer pdfData={viewingPdf} />}
        </DialogContent>
      </Dialog>

      {/* Invoices Table */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading invoices...</p>
            </div>
          </CardContent>
        </Card>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first invoice</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.clientName}</TableCell>
                  <TableCell>{currency}{invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditInvoice(invoice)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewPdf(invoice)}
                        title="View PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadPdf(invoice)}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
