import { AnimatePresence, motion } from "framer-motion";
import { Camera, LayoutDashboard, LogOut, Menu, Search, Sparkles, Upload, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Upload" },
];

// Navbar is a floating sticky blur surface with responsive mobile navigation and user dropdown.
export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    notify("Logged out from Lumora.", "success");
    navigate("/");
  };

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <nav className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Lumora</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-400">
            <Search className="h-4 w-4" />
            <span>Search visuals</span>
          </div>
          {user ? (
            <div className="relative">
              <button
                aria-label="Open profile menu"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="glass-panel absolute right-0 mt-3 w-56 rounded-2xl p-2"
                  >
                    <Link to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/10">
                      <LayoutDashboard className="h-4 w-4" />
                      Profile summary
                    </Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-200 hover:bg-white/10">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-blue-100">
              Login
            </Link>
          )}
        </div>

        <button aria-label="Open mobile menu" className="rounded-2xl border border-white/10 p-2 lg:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel mx-auto mt-3 max-w-7xl rounded-2xl p-3 lg:hidden"
          >
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-200 hover:bg-white/10">
                {link.to === "/gallery" ? <Camera className="h-4 w-4" /> : link.to === "/upload" ? <Upload className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-200 hover:bg-white/10">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-white px-3 py-3 text-center text-sm font-semibold text-zinc-950">
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
