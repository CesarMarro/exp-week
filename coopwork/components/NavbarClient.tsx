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
  { href: "/projects/new", label: "Crear" },
  { href: "/profile", label: "Perfil" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative block py-1 outline-none">
      <motion.span
        className="relative z-10 block text-sm text-slate-300 group-hover:text-white"
        initial={false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      <span
        className="absolute bottom-0 left-0 h-px w-0 bg-indigo-400 transition-[width] duration-200 ease-out group-hover:w-full"
        aria-hidden
      />
    </Link>
  );
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();
  const { scrollY } = useScroll();
  const navBlur = useTransform(scrollY, [0, 100], ["blur(16px)", "blur(24px)"]);
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(99, 102, 241, 0.2)", "rgba(99, 102, 241, 0.28)"]
  );

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string)
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const displayName =
    (user?.user_metadata?.full_name as string) ?? user?.email ?? "Usuario";

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.78)",
        backdropFilter: navBlur,
        WebkitBackdropFilter: navBlur,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: navBorder,
        boxShadow: "0 0 24px rgba(99, 102, 241, 0.08)",
      }}
      className="fixed top-0 z-50 w-full"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-0.5 outline-none">
          <motion.span
            className="text-xl font-bold text-white"
            initial={false}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Coop
          </motion.span>
          <motion.span
            className="text-xl font-bold text-indigo-400"
            initial={false}
            whileHover={{ scale: 1.03, x: 1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Work
          </motion.span>
        </Link>

        <div className="flex items-center gap-8">
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
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25"
                  initial={false}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {initials}
                </motion.div>
                <span className="max-w-[120px] truncate text-sm text-slate-300">
                  {displayName}
                </span>
              </div>
              <motion.button
                onClick={handleSignOut}
                className="rounded-lg border border-slate-600/80 bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-300"
                initial={false}
                whileHover={{
                  borderColor: "rgba(148, 163, 184, 0.5)",
                  color: "rgb(255 255 255)",
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Salir
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
              <Link href="/login" className="block">
                <motion.span
                  className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
                  initial={false}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 28px rgba(99, 102, 241, 0.35)",
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
