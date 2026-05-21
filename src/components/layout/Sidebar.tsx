import { BarChart3, Clock3, Heart, ImagePlus, Images, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const sidebarLinks = [
  { to: "/dashboard", label: "Overview", icon: BarChart3 },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/upload", label: "Upload", icon: ImagePlus },
  { to: "/profile", label: "Profile", icon: User },
];

// Sidebar provides a compact dashboard navigation pattern for creator workflows.
export const Sidebar = () => (
  <aside className="glass-panel hidden h-fit rounded-2xl p-3 lg:sticky lg:top-28 lg:block">
    <div className="mb-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Heart className="h-4 w-4 text-blue-300" />
        Creator Studio
      </div>
      <p className="mt-2 text-xs leading-5 text-zinc-400">Manage uploads, favorites, and recent activity.</p>
    </div>
    <div className="space-y-1">
      {sidebarLinks.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
      <Clock3 className="h-4 w-4 text-violet-300" />
      Synced 2 min ago
    </div>
  </aside>
);
