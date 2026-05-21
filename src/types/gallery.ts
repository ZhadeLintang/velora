// Shared domain types keep gallery, dashboard, and Supabase services aligned.
export type Category =
  | "technology"
  | "architecture"
  | "futuristic"
  | "gaming"
  | "AI"
  | "workspace"
  | "cyberpunk"
  | "landscape";

export type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  followers: string;
};

export type GalleryPhoto = {
  id: string;
  image: string;
  title: string;
  description: string;
  category: Category;
  likes: number;
  creator: Creator;
  uploadDate: string;
  height: "short" | "medium" | "tall";
  featured?: boolean;
};

export type ActivityItem = {
  id: string;
  type: "upload" | "like" | "collection";
  title: string;
  description: string;
  time: string;
};
