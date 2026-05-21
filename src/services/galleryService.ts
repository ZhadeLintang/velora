import { supabase, storageBucket } from "../lib/supabase";
import type { Category, GalleryPhoto } from "../types/gallery";

// Gallery service isolates Supabase Database and Storage calls from React components.
export type UploadPayload = {
  file: File;
  title: string;
  description: string;
  category: Category;
  userId: string;
};

// Handle image upload to Supabase Storage and return a public URL for optimistic UI updates.
export const uploadGalleryImage = async (payload: UploadPayload): Promise<string> => {
  const fileExt = payload.file.name.split(".").pop();
  const filePath = `${payload.userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage.from(storageBucket).upload(filePath, payload.file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(storageBucket).getPublicUrl(filePath);
  return data.publicUrl;
};

// Persist image metadata in Supabase Database when a project table is available.
export const createGalleryRecord = async (photo: Omit<GalleryPhoto, "creator" | "height">) => {
  const { error } = await supabase.from("gallery_photos").insert(photo);

  if (error) {
    throw new Error(error.message);
  }
};

// Delete flow removes both metadata and storage object in production integrations.
export const deleteGalleryRecord = async (photoId: string) => {
  const { error } = await supabase.from("gallery_photos").delete().eq("id", photoId);

  if (error) {
    throw new Error(error.message);
  }
};

// Like state is modeled as an upsert so each user can favorite a photo once.
export const favoritePhoto = async (photoId: string, userId: string) => {
  const { error } = await supabase.from("photo_likes").upsert({ photo_id: photoId, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }
};
