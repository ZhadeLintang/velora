import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { GalleryFilters } from "../components/gallery/GalleryFilters";
import { ImagePreviewModal } from "../components/gallery/ImagePreviewModal";
import { galleryPhotos } from "../data/mockData";
import { getLocalUploads } from "../services/localGalleryStore";
import { useToast } from "../context/ToastContext";
import type { Category, GalleryPhoto } from "../types/gallery";

// GalleryPage provides public discovery with search, filters, infinite scroll, masonry, likes, deletes, and preview modal.
export const GalleryPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<GalleryPhoto[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const { notify } = useToast();

  useEffect(() => {
    // Import locally uploaded images into the public gallery feed on page load.
    setUploadedPhotos(getLocalUploads());
  }, []);

  const filteredPhotos = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const combinedPhotos = [...uploadedPhotos, ...galleryPhotos];

    return combinedPhotos
      .filter((photo) => !deletedIds.has(photo.id))
      .filter((photo) => category === "all" || photo.category === category)
      .filter((photo) => {
        if (!normalized) {
          return true;
        }

        return [photo.title, photo.description, photo.category, photo.creator.name].join(" ").toLowerCase().includes(normalized);
      });
  }, [category, deletedIds, query, uploadedPhotos]);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 800;
      if (nearBottom) {
        setVisibleCount((count) => Math.min(count + 6, filteredPhotos.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredPhotos.length]);

  const handleLike = (photoId: string) => {
    setLikedIds((current) => {
      const next = new Set(current);
      next.has(photoId) ? next.delete(photoId) : next.add(photoId);
      return next;
    });
    notify("Favorite updated.", "success");
  };

  const handleDelete = (photoId: string) => {
    setDeletedIds((current) => new Set(current).add(photoId));
    notify("Photo removed from this gallery view.", "info");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Public gallery</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">Explore luminous visual systems.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Curated technology, architecture, gaming, AI, cyberpunk, workspace, and landscape visuals from Lumora creators.
          </p>
        </div>
        <Link to="/upload" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-blue-100">
          <ImagePlus className="h-4 w-4" />
          Upload photo
        </Link>
      </motion.div>

      <GalleryFilters query={query} category={category} onQueryChange={setQuery} onCategoryChange={setCategory} />

      <div className="mt-6">
        {visiblePhotos.length > 0 ? (
          <div className="masonry">
            {visiblePhotos.map((photo) => (
              <GalleryCard
                key={photo.id}
                photo={photo}
                liked={likedIds.has(photo.id)}
                onPreview={setSelectedPhoto}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No visuals found" description="Try another search term or switch to a different category filter." />
        )}
      </div>

      {visibleCount < filteredPhotos.length && (
        <div className="mt-8 text-center text-sm text-zinc-500">Scroll for more curated visuals</div>
      )}

      <Link
        aria-label="Floating upload button"
        to="/upload"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-glow transition hover:scale-105"
      >
        <ImagePlus className="h-6 w-6" />
      </Link>

      <ImagePreviewModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </section>
  );
};
