import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Heart, MessageCircle, Send, User, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { addPhotoComment, getPhotoComments, type GalleryComment } from "../../services/commentStore";
import type { GalleryPhoto } from "../../types/gallery";

type ImagePreviewModalProps = {
  photo: GalleryPhoto | null;
  onClose: () => void;
};

// ImagePreviewModal uses Framer Motion for image preview, metadata, and per-photo comments.
export const ImagePreviewModal = ({ photo, onClose }: ImagePreviewModalProps) => {
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setComments(photo ? getPhotoComments(photo.id) : []);
    setMessage("");
  }, [photo]);

  const handleSubmitComment = (event: FormEvent) => {
    event.preventDefault();

    if (!photo || !message.trim()) {
      return;
    }

    const nextComment = addPhotoComment(photo.id, message.trim());
    setComments((current) => [...current, nextComment]);
    setMessage("");
  };

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass-panel max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid lg:grid-cols-[1.2fr_.8fr]">
              <img src={photo.image} alt={photo.title} className="h-[42vh] w-full object-cover lg:h-[82vh]" />
              <div className="flex max-h-[82vh] flex-col overflow-y-auto p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium capitalize text-blue-300">{photo.category}</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">{photo.title}</h2>
                  </div>
                  <button aria-label="Close preview" onClick={onClose} className="rounded-full bg-white/10 p-2 text-zinc-300 hover:bg-white/15">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-zinc-300">{photo.description}</p>
                <div className="mt-6 grid gap-3 text-sm text-zinc-300">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                    <User className="h-4 w-4 text-violet-300" />
                    {photo.creator.name} - {photo.creator.role}
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                    <Heart className="h-4 w-4 text-blue-300" />
                    {photo.likes.toLocaleString()} likes
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                    <Calendar className="h-4 w-4 text-zinc-300" />
                    Uploaded {photo.uploadDate}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                      <MessageCircle className="h-5 w-5 text-blue-300" />
                      Comments
                    </h3>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">{comments.length}</span>
                  </div>

                  <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="rounded-2xl bg-white/5 p-3">
                          <div className="flex items-center gap-3">
                            <img src={comment.avatar} alt={comment.author} className="h-8 w-8 rounded-full object-cover" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{comment.author}</p>
                              <p className="text-xs text-zinc-500">
                                {comment.handle} - {comment.createdAt}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-zinc-300">{comment.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm leading-6 text-zinc-500">
                        No comments yet. Start the conversation for this visual.
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2">
                    <input
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Write a thoughtful comment..."
                      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-blue-400"
                    />
                    <button type="submit" aria-label="Send comment" className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-zinc-950 transition hover:bg-blue-100">
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
