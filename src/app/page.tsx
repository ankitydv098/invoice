"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Settings, ArrowRight } from 'lucide-react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700', '900'] });

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const features = [
    {
      title: "Manage Invoices",
      description: "Create, view, edit, and delete your invoices with ease. Generate PDF documents instantly.",
      icon: FileText,
      href: "/invoices",
      gradient: "from-red-500/20 to-orange-500/20"
    },
    {
      title: "Manage Clients",
      description: "Keep track of all your client information and relationships in one centralized place.",
      icon: Users,
      href: "/clients",
      gradient: "from-red-600/20 to-pink-500/20"
    },
    {
      title: "Settings",
      description: "Configure your application settings and customize your experience.",
      icon: Settings,
      href: "/settings",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-8">
            <h1 className={`${orbitron.className} text-7xl md:text-8xl font-black tracking-wider bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:drop-shadow-[0_0_50px_rgba(239,68,68,0.8)] transition-all duration-300`}>
              INVOICE
            </h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Ultimate{' '}
            <span className="bg-gradient-to-r from-primary via-red-500 to-red-600 bg-clip-text text-transparent">
              Billing Solution
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your workflow, manage clients efficiently, and get paid faster.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 glow-red-sm`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={feature.href}>
                    <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
            <CardDescription>
              Get started with InvoiceApp in three simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 text-primary font-bold">1</div>
                <h3 className="font-semibold mb-2">Add Clients</h3>
                <p className="text-sm text-muted-foreground">Set up your client database with their contact information</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 text-primary font-bold">2</div>
                <h3 className="font-semibold mb-2">Create Invoices</h3>
                <p className="text-sm text-muted-foreground">Generate professional invoices in seconds</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 text-primary font-bold">3</div>
                <h3 className="font-semibold mb-2">Export & Send</h3>
                <p className="text-sm text-muted-foreground">Download PDFs and send them to your clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
