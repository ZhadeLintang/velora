import { motion } from "framer-motion";
import { Lock, Mail, Sparkles, User } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getEditableProfile, saveEditableProfile } from "../services/profileStore";

// RegisterPage creates a Supabase Auth account and falls back to demo session without credentials.
export const RegisterPage = () => {
  const [fullName, setFullName] = useState("Lumora Creator");
  const [username, setUsername] = useState("lumora.creator");
  const [email, setEmail] = useState("creator@lumora.app");
  const [password, setPassword] = useState("lumora-demo");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await register(email, password);
      // Seed the editable profile with registration identity for demo mode and future Supabase profiles sync.
      saveEditableProfile({
        ...getEditableProfile(),
        name: fullName,
        handle: username.startsWith("@") ? username : `@${username}`,
      });
      notify("Lumora account created.", "success");
      navigate("/dashboard");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Unable to register.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 px-4 pb-20 lg:grid-cols-2">
      <motion.form initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleSubmit} className="glass-panel order-2 rounded-2xl p-6 md:p-8 lg:order-1">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-white">Create your studio</h2>
        <label className="mt-6 block text-sm text-zinc-300">
          Full name
          <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <User className="h-4 w-4 text-zinc-500" />
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full bg-transparent text-white outline-none" type="text" required />
          </span>
        </label>
        <label className="mt-4 block text-sm text-zinc-300">
          Username
          <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <User className="h-4 w-4 text-zinc-500" />
            <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full bg-transparent text-white outline-none" type="text" required />
          </span>
        </label>
        <label className="mt-4 block text-sm text-zinc-300">
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
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-white outline-none" type="password" minLength={6} required />
          </span>
        </label>
        <button disabled={loading} className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-blue-100 disabled:opacity-60">
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="mt-5 text-center text-sm text-zinc-400">
          Already have an account? <Link to="/login" className="font-semibold text-blue-300">Login</Link>
        </p>
      </motion.form>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="order-1 lg:order-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Creator onboarding</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">Publish luminous galleries with modern infrastructure.</h1>
        <p className="mt-5 text-base leading-7 text-zinc-400">Register unlocks protected dashboard, profile, upload tooling, and Supabase-backed persistence when credentials are provided.</p>
      </motion.div>
    </section>
  );
};
