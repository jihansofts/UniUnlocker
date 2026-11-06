"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Send, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "servers", label: "Servers" },
  { id: "contact", label: "Contact" },
];

export function Navbar({ brand }: { brand: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Sections stream in after hydration, so a MutationObserver picks up late arrivals.
  useEffect(() => {
    if (!onHome) return;
    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const observeSections = () => {
      for (const { id } of LINKS) {
        const section = document.getElementById(id);
        if (section) intersection.observe(section);
      }
    };
    observeSections();
    const mutation = new MutationObserver(observeSections);
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => {
      intersection.disconnect();
      mutation.disconnect();
    };
  }, [onHome]);

  const linkClass = (id: string) =>
    `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
      onHome && active === id
        ? "bg-linear-to-r from-primary to-[#00b4ff] shadow-[0_0_16px_rgb(8_123_255/0.6)]"
        : "text-foreground/85 hover:text-cyan"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/30 bg-background/80 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link href="/#home" aria-label="Home" onClick={() => setOpen(false)}>
          {brand}
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <Link href={`/#${id}`} aria-current={onHome && active === id ? "true" : undefined} className={linkClass(id)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/#contact" className="btn-outline hidden min-h-10! px-5! text-sm sm:inline-flex">
            Hire Me <Send aria-hidden className="size-4" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="flex size-11 items-center justify-center rounded-lg border border-line lg:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line/30 px-5 lg:hidden"
          >
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <Link href={`/#${id}`} onClick={() => setOpen(false)} className="block py-3 font-medium hover:text-cyan">
                  {label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
