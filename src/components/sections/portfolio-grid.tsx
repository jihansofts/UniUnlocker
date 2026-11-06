"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import type { ProjectDTO } from "@/types";

const ALL = "All";

export function PortfolioGrid({ projects }: { projects: ProjectDTO[] }) {
  const [category, setCategory] = useState(ALL);
  const categories = useMemo(
    () => [ALL, ...new Set(projects.map((project) => project.category))],
    [projects],
  );
  // The chosen category can disappear if projects change, so fall back to All.
  const activeCategory = categories.includes(category) ? category : ALL;
  const visible = projects.filter((p) => activeCategory === ALL || p.category === activeCategory);

  return (
    <>
      {categories.length > 2 && (
        <div role="group" aria-label="Filter projects by category" className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === activeCategory}
              onClick={() => setCategory(name)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                name === activeCategory
                  ? "border-cyan bg-primary/30 text-foreground shadow-[0_0_14px_rgb(0_229_255/0.4)]"
                  : "border-line text-muted hover:border-cyan hover:text-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              <article className="neon-card neon-card-hover group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SafeImage
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div aria-hidden className="photo-tint" />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                  {project.featured && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-purple/90 px-2.5 py-1 text-xs font-semibold">
                      <Star aria-hidden className="size-3" /> Featured
                    </span>
                  )}
                  <span className="absolute right-3 bottom-3 rounded-full border border-cyan/60 bg-background/80 px-2.5 py-0.5 text-xs text-cyan">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="font-display leading-snug font-semibold">{project.title}</h3>
                  <p className="flex-1 text-sm text-muted">{project.shortDescription}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Link
                      href={`/portfolio/${project.slug}`}
                      aria-label={`View details for ${project.title}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline"
                    >
                      View details
                      <span className="flex size-7 items-center justify-center rounded-full border-2 border-cyan transition group-hover:translate-x-0.5">
                        <ArrowRight aria-hidden className="size-4" />
                      </span>
                    </Link>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${project.title} in a new tab`}
                        className="text-muted hover:text-cyan"
                      >
                        <ExternalLink aria-hidden className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
