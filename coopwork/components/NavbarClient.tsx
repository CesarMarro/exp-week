"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface NavbarClientProps {
  user: User | null;
}

const navLinks = [
  { href: "/projects", label: "Proyectos" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative block rounded-xl px-4 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label={label}
    >
      <motion.span
        className="relative z-10 block text-base font-medium text-slate-300 group-hover:text-white"
        initial={false}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      <span
        className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      />
      <span
        className="absolute bottom-1.5 left-4 right-4 h-px w-0 bg-indigo-400/80 transition-[width] duration-200 ease-out group-hover:w-[calc(100%-2rem)]"
        aria-hidden
      />
    </Link>
  );
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();
  const { scrollY } = useScroll();
  const navBlur = useTransform(
    scrollY,
    [0, 80],
    ["blur(20px) saturate(180%)", "blur(28px) saturate(200%)"]
  );

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.72)",
        backdropFilter: navBlur,
        WebkitBackdropFilter: navBlur,
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 4px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      }}
      className="fixed top-0 z-50 w-full"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:rounded-lg"
          aria-label="CoopWork - Ir al inicio"
        >
          <motion.span
            className="text-2xl font-bold tracking-tight text-white md:text-3xl"
            initial={false}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Coop
          </motion.span>
          <motion.span
            className="text-2xl font-bold tracking-tight text-indigo-400 md:text-3xl"
            initial={false}
            whileHover={{ scale: 1.03, x: 2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Work
          </motion.span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.08 * (i + 1),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <NavLink href={link.href} label={link.label} />
            </motion.div>
          ))}

          {user ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.button
                onClick={handleSignOut}
                type="button"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-shadow hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                initial={false}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 12px 32px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                aria-label="Cerrar sesión"
              >
                Cerrar sesión
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href="/login"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label="Iniciar sesión"
              >
                <motion.span
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-shadow hover:shadow-indigo-500/40"
                  initial={false}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 12px 32px rgba(99, 102, 241, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  Iniciar sesión
                </motion.span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
