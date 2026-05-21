import { creators } from "../data/mockData";
import type { Category, GalleryPhoto } from "../types/gallery";

const LOCAL_UPLOADS_KEY = "lumora.localUploads";

type LocalUploadInput = {
  image: string;
  title: string;
  description: string;
  category: Category;
  creatorEmail?: string;
};

// Local gallery store mirrors uploaded images into the demo app when Supabase Database is not configured.
export const getLocalUploads = (): GalleryPhoto[] => {
  try {
    const rawUploads = window.localStorage.getItem(LOCAL_UPLOADS_KEY);
    return rawUploads ? (JSON.parse(rawUploads) as GalleryPhoto[]) : [];
  } catch {
    return [];
  }
};

// saveLocalUpload imports a published upload into the gallery feed with production-like metadata.
export const saveLocalUpload = (input: LocalUploadInput): GalleryPhoto => {
  const existingUploads = getLocalUploads();
  const creator = {
    ...creators[0],
    name: input.creatorEmail?.split("@")[0] ?? creators[0].name,
    handle: input.creatorEmail ?? creators[0].handle,
  };

  const nextUpload: GalleryPhoto = {
    id: `local-${crypto.randomUUID()}`,
    image: input.image,
    title: input.title,
    description: input.description,
    category: input.category,
    likes: 0,
    creator,
    uploadDate: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date()),
    height: "medium",
    featured: false,
  };

  window.localStorage.setItem(LOCAL_UPLOADS_KEY, JSON.stringify([nextUpload, ...existingUploads]));
  return nextUpload;
};

// readFileAsDataUrl keeps demo uploads visible after route changes without requiring backend credentials.
export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
