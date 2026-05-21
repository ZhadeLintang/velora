import { creators } from "../data/mockData";

const LOCAL_PROFILE_KEY = "lumora.profile";

export type EditableProfile = {
  name: string;
  handle: string;
  role: string;
  bio: string;
  location: string;
  avatar: string;
  cover: string;
  followers: string;
};

const defaultProfile: EditableProfile = {
  name: creators[0].name,
  handle: creators[0].handle,
  role: creators[0].role,
  bio: "AI visual curator building premium references across technology, cinematic workspaces, cyberpunk systems, and futuristic product environments.",
  location: "Jakarta",
  avatar: creators[0].avatar,
  cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=85",
  followers: creators[0].followers,
};

// Profile store keeps the demo edit-profile flow persistent until a Supabase profiles table is connected.
export const getEditableProfile = (): EditableProfile => {
  try {
    const rawProfile = window.localStorage.getItem(LOCAL_PROFILE_KEY);
    return rawProfile ? { ...defaultProfile, ...(JSON.parse(rawProfile) as EditableProfile) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
};

// saveEditableProfile mirrors a production profile update API and centralizes local persistence.
export const saveEditableProfile = (profile: EditableProfile): EditableProfile => {
  window.localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  return profile;
};
