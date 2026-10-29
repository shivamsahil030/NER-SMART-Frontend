import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Platform", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Impact", href: "#impact" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center"><Brand dark /></a>
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} data-testid={`nav-${l.label.toLowerCase().replace(/ /g, "-")}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:text-brand">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/login" className="inline-block"><Button variant="ghost" data-testid="nav-login-btn" className="text-white hover:bg-white/10 hover:text-white">Login</Button></Link>
          <Link to="/login" className="inline-block"><Button data-testid="nav-getstarted-btn" className="gap-1.5 bg-brand font-semibold text-ink hover:bg-brand-light">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <button className="flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 transition-colors lg:hidden" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle" aria-label="Toggle navigation menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-ink/95 p-4 backdrop-blur lg:hidden">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5">{l.label}</a>
          ))}
          <div className="mt-3 flex gap-2">
            <Link to="/login" className="flex-1 block"><Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10">Login</Button></Link>
            <Link to="/login" className="flex-1 block"><Button className="w-full bg-brand font-semibold text-ink hover:bg-brand-light">Get Started</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
