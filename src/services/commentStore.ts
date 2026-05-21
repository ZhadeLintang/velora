import { getEditableProfile } from "./profileStore";

const LOCAL_COMMENTS_KEY = "lumora.comments";

export type GalleryComment = {
  id: string;
  photoId: string;
  author: string;
  handle: string;
  avatar: string;
  message: string;
  createdAt: string;
};

type CommentMap = Record<string, GalleryComment[]>;

const readCommentMap = (): CommentMap => {
  try {
    const rawComments = window.localStorage.getItem(LOCAL_COMMENTS_KEY);
    return rawComments ? (JSON.parse(rawComments) as CommentMap) : {};
  } catch {
    return {};
  }
};

// getPhotoComments reads persisted gallery comments for the selected preview photo.
export const getPhotoComments = (photoId: string): GalleryComment[] => {
  const comments = readCommentMap();
  return comments[photoId] ?? [];
};

// addPhotoComment creates a production-like comment record using the current editable profile identity.
export const addPhotoComment = (photoId: string, message: string): GalleryComment => {
  const comments = readCommentMap();
  const profile = getEditableProfile();
  const nextComment: GalleryComment = {
    id: `comment-${crypto.randomUUID()}`,
    photoId,
    author: profile.name,
    handle: profile.handle,
    avatar: profile.avatar,
    message,
    createdAt: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
  };

  const nextComments = {
    ...comments,
    [photoId]: [...(comments[photoId] ?? []), nextComment],
  };

  window.localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(nextComments));
  return nextComment;
};
