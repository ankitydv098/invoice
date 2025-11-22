'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

interface InvoiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id?: string;
    clientName: string;
    amount: number;
    status: 'pending' | 'paid';
    dueDate?: string;
    description?: string;
  };
}

export default function InvoiceForm({ onSuccess, onCancel, initialData }: InvoiceFormProps) {
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [amount, setAmount] = useState<number>(initialData?.amount ?? 0);
  const [status, setStatus] = useState<'pending' | 'paid'>(initialData?.status ?? 'pending');
  const [dueDate, setDueDate] = useState<string>(initialData?.dueDate || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Client fetch error:', errorText);
          throw new Error(`Failed to fetch clients: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          console.error('Invalid clients data format:', data);
          setClients([]);
        }
      } catch (err: any) {
        console.error('Error fetching clients:', err?.message ?? err);
        // Don't set error state to avoid blocking the form
        // User can still type client name manually
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!clientName || !clientName.trim()) {
        throw new Error('Client name is required');
      }
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const method = initialData?.id ? 'PUT' : 'POST';
      const url = initialData?.id ? `/api/invoices/${initialData.id}` : '/api/invoices';

      const payload = { 
        clientName: clientName.trim(), 
        amount: Number(amount), 
        status,
        dueDate: dueDate || null,
        description: description || null
      };

      console.log('Submitting invoice:', payload);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = 'Failed to save invoice';
        try {
          const errorData = await res.json();
          message = errorData?.message ?? message;
        } catch {
          const errorText = await res.text();
          console.error('Server error:', errorText);
        }
        throw new Error(message);
      }

      const result = await res.json();
      console.log('Invoice saved successfully:', result);
      onSuccess();
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Filter client suggestions based on input
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientName.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <div className="relative">
          <Input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            required
            placeholder="Enter or select client name"
            autoComplete="off"
          />
          {showSuggestions && filteredClients.length > 0 && clientName && (
            <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => {
                    setClientName(client.name);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-accent transition-colors text-sm"
                >
                  {client.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Type any name or select from existing clients</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value === '' ? 0 : parseFloat(e.target.value))}
          required
          min={0}
          step="0.01"
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date (Optional)</Label>
        <Input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Select due date"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add invoice description or notes"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as 'pending' | 'paid')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Update Invoice' : 'Create Invoice'
          )}
        </Button>
      </div>
    </form>
  );
}
