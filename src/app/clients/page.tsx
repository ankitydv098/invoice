'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Loader2, Trash2, Users as UsersIcon } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  address?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchClients();
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await fetch(`/api/clients/${id}`, {
          method: 'DELETE',
        });
        fetchClients();
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    const form = e.target as HTMLFormElement & {
      clientName: { value: string };
      clientEmail: { value: string };
      clientAddress: { value: string };
    };

    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.clientName.value,
          email: form.clientEmail.value,
          address: form.clientAddress.value,
        }),
      });
      setShowAddClientModal(false);
      form.reset();
      fetchClients();
    } catch (error) {
      console.error('Failed to create client:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Clients</h1>
          <p className="text-muted-foreground">Manage your client database</p>
        </div>
        <Button onClick={() => setShowAddClientModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddClientModal} onOpenChange={setShowAddClientModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client's information below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input type="text" id="clientName" name="clientName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input type="email" id="clientEmail" name="clientEmail" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Client Address</Label>
              <Input type="text" id="clientAddress" name="clientAddress" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={() => setShowAddClientModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading} className="flex-1">
                {submitLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Client'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Clients Table */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading clients...</p>
            </div>
          </CardContent>
        </Card>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted mb-4">
              <UsersIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No clients found</h3>
            <p className="text-muted-foreground mb-4">Add your first client to get started</p>
            <Button onClick={() => setShowAddClientModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell className="text-muted-foreground">{client.address || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteClient(client.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
