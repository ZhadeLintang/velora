import { motion } from "framer-motion";
import { Calendar, Heart, Trash2 } from "lucide-react";
import type { GalleryPhoto } from "../../types/gallery";

type GalleryCardProps = {
  photo: GalleryPhoto;
  onPreview: (photo: GalleryPhoto) => void;
  onLike: (photoId: string) => void;
  onDelete?: (photoId: string) => void;
  liked?: boolean;
};

// GalleryCard renders each masonry image with creator metadata, category, likes, and card hover interaction.
export const GalleryCard = ({ photo, onPreview, onLike, onDelete, liked = false }: GalleryCardProps) => {
  const heightClass = photo.height === "tall" ? "h-[28rem]" : photo.height === "medium" ? "h-80" : "h-64";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className="masonry-item group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-glass backdrop-blur-xl"
    >
      <button className="relative block w-full overflow-hidden text-left" onClick={() => onPreview(photo)}>
        <img src={photo.image} alt={photo.title} className={`${heightClass} w-full object-cover transition duration-700 group-hover:scale-105`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur-xl">
          {photo.category}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white">{photo.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-300">{photo.description}</p>
        </div>
      </button>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src={photo.creator.avatar} alt={photo.creator.name} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{photo.creator.name}</p>
            <p className="flex items-center gap-1 text-xs text-zinc-500">
              <Calendar className="h-3 w-3" />
              {photo.uploadDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label={`Like ${photo.title}`}
            onClick={() => onLike(photo.id)}
            className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs transition ${
              liked ? "bg-blue-500/20 text-blue-200" : "bg-white/10 text-zinc-300 hover:bg-white/15"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-blue-300" : ""}`} />
            {photo.likes + (liked ? 1 : 0)}
          </button>
          {onDelete && (
            <button aria-label={`Delete ${photo.title}`} onClick={() => onDelete(photo.id)} className="rounded-full bg-white/10 p-2 text-zinc-400 transition hover:bg-rose-500/20 hover:text-rose-200">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
