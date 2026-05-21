import { AnimatePresence, motion } from "framer-motion";
import { Camera, Link as LinkIcon, MapPin, Save, User, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { EditableProfile } from "../../services/profileStore";

type EditProfileModalProps = {
  open: boolean;
  profile: EditableProfile;
  onClose: () => void;
  onSave: (profile: EditableProfile) => void;
};

// EditProfileModal lets creators update public profile metadata with a premium glass form.
export const EditProfileModal = ({ open, profile, onClose, onSave }: EditProfileModalProps) => {
  const [draft, setDraft] = useState<EditableProfile>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile, open]);

  const handleChange = (field: keyof EditableProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.form
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onSubmit={handleSubmit}
            className="glass-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Edit profile</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">Update creator identity.</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">Changes are saved locally now and can map cleanly to Supabase profiles later.</p>
              </div>
              <button type="button" aria-label="Close edit profile" onClick={onClose} className="rounded-full bg-white/10 p-2 text-zinc-300 transition hover:bg-white/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-zinc-300">
                Display name
                <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <User className="h-4 w-4 text-zinc-500" />
                  <input value={draft.name} onChange={(event) => handleChange("name", event.target.value)} className="w-full bg-transparent text-white outline-none" required />
                </span>
              </label>
              <label className="block text-sm text-zinc-300">
                Handle
                <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <LinkIcon className="h-4 w-4 text-zinc-500" />
                  <input value={draft.handle} onChange={(event) => handleChange("handle", event.target.value)} className="w-full bg-transparent text-white outline-none" required />
                </span>
              </label>
              <label className="block text-sm text-zinc-300">
                Role
                <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <Camera className="h-4 w-4 text-zinc-500" />
                  <input value={draft.role} onChange={(event) => handleChange("role", event.target.value)} className="w-full bg-transparent text-white outline-none" required />
                </span>
              </label>
              <label className="block text-sm text-zinc-300">
                Studio location
                <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  <input value={draft.location} onChange={(event) => handleChange("location", event.target.value)} className="w-full bg-transparent text-white outline-none" required />
                </span>
              </label>
              <label className="block text-sm text-zinc-300 md:col-span-2">
                Bio
                <textarea value={draft.bio} onChange={(event) => handleChange("bio", event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-blue-400" required />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                Cancel
              </button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-blue-100">
                <Save className="h-4 w-4" />
                Save profile
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
