import { Search, SlidersHorizontal } from "lucide-react";
import { categories } from "../../data/mockData";
import type { Category } from "../../types/gallery";

type GalleryFiltersProps = {
  query: string;
  category: Category | "all";
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: Category | "all") => void;
};

// GalleryFilters manages search and category state for fast discovery across public gallery content.
export const GalleryFilters = ({ query, category, onQueryChange, onCategoryChange }: GalleryFiltersProps) => (
  <div className="glass-panel rounded-2xl p-3">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-400">
        <Search className="h-4 w-4" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search photos, creators, categories..."
          className="w-full border-0 bg-transparent text-white outline-none placeholder:text-zinc-500"
        />
      </label>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-zinc-300">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        {(["all", ...categories] as Array<Category | "all">).map((item) => (
          <button
            key={item}
            onClick={() => onCategoryChange(item)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-medium capitalize transition ${
              category === item ? "bg-white text-zinc-950" : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  </div>
);
