import { SearchX } from "lucide-react";

// EmptyState communicates filtered gallery results without leaving blank pages.
export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="glass-panel flex min-h-72 flex-col items-center justify-center rounded-2xl p-8 text-center">
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
      <SearchX className="h-6 w-6 text-blue-300" />
    </div>
    <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">{description}</p>
  </div>
);
