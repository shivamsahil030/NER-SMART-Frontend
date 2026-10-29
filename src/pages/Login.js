import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DEMO_CREDENTIALS } from "@/data/mockData";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = login("user", email, password);
    if (res.ok) { toast.success("Signed in as Logistics Driver"); navigate("/app"); }
    else { setErr(res.error); toast.error(res.error); }
  };

  const loadDemo = () => {
    const c = DEMO_CREDENTIALS.user;
    setEmail(c.email); setPassword(c.password); setErr("");
    toast.info("Driver profile loaded — press Secure Login.");
  };

  return (
    <div className="grid min-h-screen bg-ink lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute inset-0 gov-grid opacity-[0.15]" />
        <div className="relative"><Brand dark size="lg" /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <h1 className="font-head text-4xl font-extrabold leading-tight text-white">
            Smart Logistics.<br />Safer Routes.<br /><span className="text-brand">Connected NER.</span>
          </h1>
          <p className="mt-5 max-w-md text-slate-400">
            AI-powered logistics and accessibility intelligence for safer movement of essential goods across the North Eastern Region's difficult terrain. Built to handle landslides, seasonal floods, and structural bottlenecks.
          </p>
        </motion.div>
        <div className="relative">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Essential Goods Carrier Access</p>
          <div className="mt-3 flex gap-2">
            <span className="h-8 w-20 rounded-md bg-white/5" />
            <span className="h-8 w-16 rounded-md bg-white/5" />
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-slate-50 px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between lg:hidden"><Brand /><Link to="/" className="text-sm text-slate-500"><ArrowLeft className="h-5 w-5" /></Link></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl">
            <h2 className="font-head text-2xl font-bold text-ink">Command Center Access</h2>
            <p className="mt-1 text-sm text-slate-500">Enter credentials as a registered essential goods carrier</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label className="text-slate-700">Email / Mobile Number</Label>
                <Input data-testid="login-email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="pradeep.sangma@nerlogistics.in" className="mt-1.5 h-11" />
              </div>
              <div>
                <Label className="text-slate-700">Password</Label>
                <div className="relative mt-1.5">
                  <Input data-testid="login-password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" className="h-11 pr-10" />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" data-testid="toggle-password">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600"><Checkbox data-testid="remember-me" /> Remember me</label>
                <button type="button" onClick={() => toast.info("Password reset link sent (simulated).")} className="text-sm font-semibold text-brand-dark hover:underline" data-testid="forgot-password">Forgot Password?</button>
              </div>
              {err && <p data-testid="login-error" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
              <Button type="submit" data-testid="login-submit" className="h-11 w-full bg-brand font-semibold text-ink hover:bg-brand-dark hover:text-white">Secure Login</Button>
            </form>

            <div className="mt-5 rounded-xl border border-brand/30 bg-brand/5 p-4">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-dark">Quick Access</p>
              <button data-testid="load-demo-btn" onClick={loadDemo} className="mt-2 rounded-lg border border-brand/40 bg-white px-3 py-1.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand hover:text-ink">
                Load Driver Profile
              </button>
            </div>
            <Link to="/" className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
