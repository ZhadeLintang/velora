import { motion } from "framer-motion";
import { Camera, Heart, MapPin, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { creators, galleryPhotos } from "../data/mockData";
import { useToast } from "../context/ToastContext";
import { getLocalUploads } from "../services/localGalleryStore";
import { getEditableProfile, saveEditableProfile } from "../services/profileStore";
import { useAuth } from "../context/AuthContext";

// ProfilePage displays creator identity, profile data, favorites, and uploaded gallery highlights.
export const ProfilePage = () => {
  const { user } = useAuth();
  const { notify } = useToast();
  const [profile, setProfile] = useState(() => getEditableProfile());
  const [editOpen, setEditOpen] = useState(false);
  const creator = creators[0];
  const uploads = [...getLocalUploads(), ...galleryPhotos.filter((photo) => photo.creator.id === creator.id)].slice(0, 6);

  const handleSaveProfile = (nextProfile: typeof profile) => {
    // Persist edited profile data locally for demo mode and update the visible profile immediately.
    const savedProfile = saveEditableProfile(nextProfile);
    setProfile(savedProfile);
    setEditOpen(false);
    notify("Profile updated successfully.", "success");
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden rounded-2xl">
          <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${profile.cover})` }} />
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <img src={profile.avatar} alt={profile.name} className="-mt-20 h-28 w-28 rounded-2xl border-4 border-zinc-950 object-cover shadow-glass" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Creator profile</p>
                  <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{profile.name}</h1>
                  <p className="mt-2 text-sm text-zinc-400">{user?.email ?? profile.handle} · {profile.role}</p>
                </div>
              </div>
              <button onClick={() => setEditOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-blue-100">
                <Sparkles className="h-4 w-4" />
                Edit profile
              </button>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300">{profile.bio}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <Camera className="h-5 w-5 text-blue-300" />
                <p className="mt-3 text-2xl font-bold text-white">42</p>
                <p className="text-sm text-zinc-400">Uploads</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Heart className="h-5 w-5 text-violet-300" />
                <p className="mt-3 text-2xl font-bold text-white">18.8K</p>
                <p className="text-sm text-zinc-400">Likes</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Users className="h-5 w-5 text-blue-300" />
                <p className="mt-3 text-2xl font-bold text-white">{profile.followers}</p>
                <p className="text-sm text-zinc-400">Followers</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <MapPin className="h-5 w-5 text-violet-300" />
                <p className="mt-3 text-2xl font-bold text-white">{profile.location}</p>
                <p className="text-sm text-zinc-400">Studio</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {uploads.map((photo) => (
            <motion.div key={photo.id} whileHover={{ y: -6 }} className="glass-panel overflow-hidden rounded-2xl">
              <img src={photo.image} alt={photo.title} className="h-64 w-full object-cover" />
              <div className="p-4">
                <p className="text-sm font-semibold text-white">{photo.title}</p>
                <p className="mt-1 text-xs capitalize text-zinc-500">{photo.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <EditProfileModal open={editOpen} profile={profile} onClose={() => setEditOpen(false)} onSave={handleSaveProfile} />
    </section>
  );
};
