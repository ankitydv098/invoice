import React, { useState, useEffect } from 'react';

interface EditInvoiceFormProps {
  invoice: {
    id: string;
    clientName: string;
    amount: number;
    status: 'pending' | 'paid';
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditInvoiceForm({ invoice, onSuccess, onCancel }: EditInvoiceFormProps) {
  const [clientName, setClientName] = useState(invoice.clientName);
  const [amount, setAmount] = useState(invoice.amount);
  const [status, setStatus] = useState<'pending' | 'paid'>(invoice.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientName, amount, status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update invoice');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      {error && <p >{error}</p>}
      <div>
        <label htmlFor="clientName" >Client Name</label>
        <input
          type="text"
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'paid')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div >
        <button
          type="button"
          onClick={onCancel}
          
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          
        >
          {loading ? 'Saving...' : 'Update Invoice'}
        </button>
      </div>
    </form>
  );
}