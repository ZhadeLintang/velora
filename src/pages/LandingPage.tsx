import { motion } from "framer-motion";
import { ArrowRight, Eye, Heart, ImagePlus, Layers, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { creators, galleryPhotos } from "../data/mockData";

const stats = [
  { label: "Curated visuals", value: "42K+" },
  { label: "Creator reach", value: "8.7M" },
  { label: "Monthly saves", value: "318K" },
  { label: "Collections", value: "12.4K" },
];

// LandingPage presents Lumora as a premium startup gallery with bento cards, creators, trends, stats, and CTA.
export const LandingPage = () => {
  const featured = galleryPhotos.filter((photo) => photo.featured).slice(0, 3);

  return (
    <div className="pb-24">
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 28, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.65 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-200 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Gallery intelligence for visual creators
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
            Lumora
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            A premium bento gallery for futuristic photography, AI visuals, technology spaces, and creator-led inspiration boards.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/gallery" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-blue-100">
              Explore gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              Start creating
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7 }} className="grid grid-cols-6 gap-4">
          <div className="glass-panel col-span-6 overflow-hidden rounded-2xl lg:col-span-4">
            <img src={galleryPhotos[0].image} alt={galleryPhotos[0].title} className="h-72 w-full object-cover" />
            <div className="p-5">
              <p className="text-sm text-blue-300">Featured system</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{galleryPhotos[0].title}</h2>
            </div>
          </div>
          <div className="glass-panel col-span-6 rounded-2xl p-5 lg:col-span-2">
            <Layers className="h-8 w-8 text-violet-300" />
            <p className="mt-5 text-sm leading-6 text-zinc-300">Bento curation boards organize uploads by style, creator, and visual momentum.</p>
            <div className="mt-6 flex -space-x-3">
              {creators.map((creator) => (
                <img key={creator.id} src={creator.avatar} alt={creator.name} className="h-10 w-10 rounded-full border-2 border-zinc-950 object-cover" />
              ))}
            </div>
          </div>
          <div className="glass-panel col-span-3 rounded-2xl p-5">
            <Eye className="h-7 w-7 text-blue-300" />
            <p className="mt-4 text-3xl font-bold text-white">2.8M</p>
            <p className="text-sm text-zinc-400">visual previews</p>
          </div>
          <div className="glass-panel col-span-3 rounded-2xl p-5">
            <Heart className="h-7 w-7 text-violet-300" />
            <p className="mt-4 text-3xl font-bold text-white">318K</p>
            <p className="text-sm text-zinc-400">monthly likes</p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader eyebrow="Bento showcase" title="Designed for premium visual discovery." description="Lumora blends masonry browsing, glass panels, creator context, and smooth motion into one focused gallery experience." />
        <div className="mt-10 grid gap-4 md:grid-cols-4 md:grid-rows-[220px_180px]">
          <motion.div whileHover={{ y: -6 }} className="glass-panel overflow-hidden rounded-2xl md:col-span-2 md:row-span-2">
            <img src={galleryPhotos[4].image} alt={galleryPhotos[4].title} className="h-full min-h-96 w-full object-cover" />
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="glass-panel rounded-2xl p-6 md:col-span-2">
            <Sparkles className="h-7 w-7 text-blue-300" />
            <h3 className="mt-6 text-2xl font-bold text-white">AI-assisted curation</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">Discover patterns across technology, cyberpunk, architecture, and workspace aesthetics.</p>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="glass-panel overflow-hidden rounded-2xl">
            <img src={galleryPhotos[7].image} alt={galleryPhotos[7].title} className="h-full w-full object-cover" />
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="glass-panel rounded-2xl p-6">
            <ImagePlus className="h-7 w-7 text-violet-300" />
            <h3 className="mt-5 text-xl font-bold text-white">Drag. Drop. Publish.</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Upload flows are wired for Supabase Storage.</p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader eyebrow="Featured creators" title="Curated by future-facing visual teams." description="Dummy creators are included so the product feels alive from the first load." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {creators.map((creator) => (
            <motion.div key={creator.id} whileHover={{ y: -6 }} className="glass-panel rounded-2xl p-5">
              <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-2xl object-cover" />
              <h3 className="mt-5 text-lg font-semibold text-white">{creator.name}</h3>
              <p className="text-sm text-blue-300">{creator.handle}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{creator.role}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
                <Users className="h-4 w-4" />
                {creator.followers} followers
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader eyebrow="Trending gallery" title="What creators are saving now." description="High-signal visuals from technology, AI, futuristic architecture, and atmospheric workspace categories." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {featured.map((photo) => (
            <GalleryCard key={photo.id} photo={photo} onPreview={() => undefined} onLike={() => undefined} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="glass-panel rounded-2xl p-6 md:p-10">
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/5 p-5 text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Build your luminous portfolio.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Register, upload, favorite, and organize visual references in a clean creator dashboard.</p>
            </div>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-4 pt-10 text-sm text-zinc-500">
        <div className="flex flex-col justify-between gap-4 border-t border-white/10 py-8 md:flex-row">
          <p>© 2026 Lumora Gallery. Premium visual discovery for modern creators.</p>
          <p>Linear-inspired calm, Framer-like motion, Pinterest-scale browsing.</p>
        </div>
      </footer>
    </div>
  );
};
