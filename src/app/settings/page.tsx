"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Settings2, User, Building, Globe, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('invoiceSettings');
        if (saved) {
          const settings = JSON.parse(saved);
          setCompanyName(settings.companyName || '');
          setCompanyEmail(settings.companyEmail || '');
          setCompanyPhone(settings.companyPhone || '');
          setCompanyAddress(settings.companyAddress || '');
          setTaxId(settings.taxId || '');
          setCurrency(settings.currency || 'INR');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage('');

    try {
      const settings = {
        companyName,
        companyEmail,
        companyPhone,
        companyAddress,
        taxId,
        currency,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('invoiceSettings', JSON.stringify(settings));
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage('Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-primary/10 glow-red-sm">
          <Settings2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Business Settings</h1>
          <p className="text-muted-foreground">Manage your company information and preferences</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Update your business details for invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 mb-6">
              <p className="text-sm text-green-500">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Name
              </Label>
              <Input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyEmail" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Company Email
                </Label>
                <Input
                  type="email"
                  id="companyEmail"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="company@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="companyPhone"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyAddress" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Address
              </Label>
              <Input
                type="text"
                id="companyAddress"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="123 Business Street, City, State"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Tax ID / GST Number
                </Label>
                <Input
                  type="text"
                  id="taxId"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="GSTIN or Tax ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Default Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                    <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={saveLoading} className="w-full">
              {saveLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}