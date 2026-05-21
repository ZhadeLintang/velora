import { motion } from "framer-motion";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { ChangeEvent, DragEvent, FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Button } from "../components/ui/Button";
import { categories } from "../data/mockData";
import { isSupabaseConfigured } from "../lib/supabase";
import { readFileAsDataUrl, saveLocalUpload } from "../services/localGalleryStore";
import { uploadGalleryImage } from "../services/galleryService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { Category } from "../types/gallery";

// UploadPage manages drag-and-drop image selection and Supabase Storage upload flow.
export const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("technology");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  const handleFile = (nextFile?: File) => {
    if (!nextFile) {
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      notify("Please upload an image file.", "error");
      return;
    }

    setFile(nextFile);
    if (!title) {
      setTitle(nextFile.name.replace(/\.[^/.]+$/, "").replace(/-/g, " "));
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file || !title || !description) {
      notify("Complete image, title, and description before publishing.", "error");
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = await readFileAsDataUrl(file);

      if (isSupabaseConfigured && user) {
        uploadedImageUrl = await uploadGalleryImage({ file, title, description, category, userId: user.id });
      }

      // Import the uploaded image into the gallery feed so the creator sees it immediately after publishing.
      saveLocalUpload({
        image: uploadedImageUrl,
        title,
        description,
        category,
        creatorEmail: user?.email,
      });

      notify(isSupabaseConfigured ? "Image uploaded and imported to Gallery." : "Demo upload imported to Gallery.", "success");
      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("technology");
      navigate("/gallery");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Upload failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Upload</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">Publish a new visual.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">Drag and drop images, add metadata, and send files to Supabase Storage when credentials are configured.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`glass-panel flex min-h-[30rem] cursor-pointer flex-col items-center justify-center rounded-2xl p-6 text-center transition ${
              dragging ? "border-blue-400 bg-blue-500/10" : ""
            }`}
          >
            <input type="file" accept="image/*" className="hidden" onChange={handleInput} />
            {previewUrl ? (
              <div className="relative w-full">
                <img src={previewUrl} alt="Upload preview" className="max-h-[34rem] w-full rounded-2xl object-cover" />
                <button type="button" aria-label="Remove selected image" onClick={() => setFile(null)} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-glow">
                  <UploadCloud className="h-8 w-8 text-white" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white">Drop your image here</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">Supports JPG, PNG, WEBP, and high-resolution visuals for gallery presentation.</p>
              </>
            )}
          </label>

          <div className="glass-panel h-fit rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">Image metadata</h2>
            <label className="mt-5 block text-sm text-zinc-300">
              Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-blue-400" />
            </label>
            <label className="mt-4 block text-sm text-zinc-300">
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-blue-400" />
            </label>
            <label className="mt-4 block text-sm text-zinc-300">
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value as Category)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-blue-400">
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" disabled={loading} className="mt-6 w-full">
              <ImagePlus className="h-4 w-4" />
              {loading ? "Publishing..." : "Publish visual"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
