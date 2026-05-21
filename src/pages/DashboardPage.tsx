import { motion } from "framer-motion";
import { BarChart3, Heart, Image, TrendingUp } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { Skeleton } from "../components/ui/Skeleton";
import { activities, galleryPhotos } from "../data/mockData";
import { getLocalUploads } from "../services/localGalleryStore";
import { useAuth } from "../context/AuthContext";

const dashboardStats = [
  { label: "Total uploads", value: "128", change: "+18%", icon: Image },
  { label: "Total likes", value: "48.2K", change: "+32%", icon: Heart },
  { label: "Profile reach", value: "1.9M", change: "+11%", icon: TrendingUp },
];

// DashboardPage summarizes upload statistics, likes, recent uploads, and creator activity timeline.
export const DashboardPage = () => {
  const { user } = useAuth();
  const uploadedPhotos = getLocalUploads();
  const recentUploads = [...uploadedPhotos, ...galleryPhotos].slice(0, 4);

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Dashboard</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">Creator command center.</h1>
          <p className="mt-4 text-base leading-7 text-zinc-400">Welcome, {user?.email ?? "creator"}. Monitor uploads, likes, recent visuals, and activity momentum.</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {dashboardStats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                  <stat.icon className="h-5 w-5 text-blue-300" />
                </div>
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-200">{stat.change}</span>
              </div>
              <p className="mt-6 text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent uploads</h2>
              <BarChart3 className="h-5 w-5 text-violet-300" />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {recentUploads.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-2xl bg-white/5">
                  <img src={photo.image} alt={photo.title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white">{photo.title}</p>
                    <p className="mt-1 text-xs capitalize text-zinc-500">{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-xl font-bold text-white">Activity timeline</h2>
            <div className="mt-5 space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="relative rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="absolute left-4 top-4 h-2 w-2 rounded-full bg-blue-300" />
                  <div className="pl-5">
                    <p className="text-sm font-semibold text-white">{activity.title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{activity.description}</p>
                    <p className="mt-3 text-xs text-zinc-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </section>
  );
};
