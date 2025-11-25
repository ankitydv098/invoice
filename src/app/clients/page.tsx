"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Client A', email: 'clienta@example.com', phone: '111-222-3333' },
    { id: '2', name: 'Client B', email: 'clientb@example.com' },
  ]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching clients
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const addClient = (newClient: Client) => {
    setClients([...clients, newClient]);
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newClient: Client = {
      id: String(clients.length + 1),
      name: form.clientName.value,
      email: form.clientEmail.value,
      phone: form.clientPhone.value,
    };
    addClient(newClient);
    setShowAddClientModal(false);
    form.reset();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Clients</h1>

      <button
        onClick={() => setShowAddClientModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mb-4"
      >
        Add New Client
      </button>

      {showAddClientModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Client</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="clientName" className="block text-gray-700 text-sm font-bold mb-2">Client Name</label>
                <input type="text" id="clientName" name="clientName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div className="mb-4">
                <label htmlFor="clientEmail" className="block text-gray-700 text-sm font-bold mb-2">Client Email</label>
                <input type="email" id="clientEmail" name="clientEmail" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div className="mb-4">
                <label htmlFor="clientPhone" className="block text-gray-700 text-sm font-bold mb-2">Client Phone</label>
                <input type="text" id="clientPhone" name="clientPhone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setShowAddClientModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors mr-2">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Add Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No clients found. Add a new client!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{client.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{client.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{client.phone || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
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