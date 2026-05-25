import { motion } from "framer-motion";
import { Lock, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// LoginPage handles Supabase sign-in and redirects protected-route users back to their intended page.
export const LoginPage = () => {
  const [email, setEmail] = useState("demo@lumora.app");
  const [password, setPassword] = useState("lumora-demo");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorText(null);

    try {
      await login(email, password);
      notify("Welcome back to Lumora.", "success");
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to login.";
      setErrorText(msg);
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 px-4 pb-20 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Secure access</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">Login to your creator studio.</h1>
        <p className="mt-5 text-base leading-7 text-zinc-400">Use Supabase Auth in production, or the prefilled demo credentials while environment variables are not configured.</p>
      </motion.div>
      <motion.form initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-white">Welcome back</h2>
        {errorText && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 backdrop-blur">
            <p className="font-semibold">Authentication Notice</p>
            <p className="mt-1 text-xs text-red-300/90 leading-5">{errorText}</p>
          </div>
        )}
        <label className="mt-6 block text-sm text-zinc-300">
          Email
          <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <Mail className="h-4 w-4 text-zinc-500" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent text-white outline-none" type="email" required />
          </span>
        </label>
        <label className="mt-4 block text-sm text-zinc-300">
          Password
          <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <Lock className="h-4 w-4 text-zinc-500" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-white outline-none" type="password" required />
          </span>
        </label>
        <button disabled={loading} className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-blue-100 disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="mt-5 text-center text-sm text-zinc-400">
          New to Lumora? <Link to="/register" className="font-semibold text-blue-300">Create account</Link>
        </p>
      </motion.form>
    </section>
  );
};