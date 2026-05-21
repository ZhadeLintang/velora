import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

// Button standardizes Lumora's premium rounded call-to-action and tool controls.
export const Button = ({ className = "", variant = "primary", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-white text-zinc-950 hover:bg-blue-100",
    secondary: "border border-white/10 bg-white/10 text-white hover:bg-white/15",
    ghost: "text-zinc-300 hover:bg-white/10 hover:text-white",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
