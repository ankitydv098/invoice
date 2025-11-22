"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';



export default function NewClientPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, address }),
      });

      if (response.ok) {
        router.push('/invoices'); // Redirect to invoices page after successful creation
      } else {
        console.error('Failed to create client');
      }
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div >
      <h1 >Add New Client</h1>
      <form onSubmit={handleSubmit} >
        <div className="mb-4">
          <label htmlFor="name" >Name:</label>
          <input
            type="text"
            id="name"
            
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
          <input
            type="text"
            id="address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          type="submit"
          
        >
          Add Client
        </button>
      </form>
    </div>
  );
}