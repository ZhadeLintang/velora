import { motion } from "framer-motion";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

// SectionHeader keeps landing and dashboard sections visually consistent.
export const SectionHeader = ({ eyebrow, title, description }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.55 }}
    className="mx-auto max-w-3xl text-center"
  >
    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">{eyebrow}</p>
    <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h2>
    <p className="mt-4 text-base leading-7 text-zinc-400">{description}</p>
  </motion.div>
);
