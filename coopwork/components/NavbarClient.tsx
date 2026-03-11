"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface NavbarClientProps {
  user: User | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          Coop<span className="text-indigo-400">Work</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/projects"
            className="text-sm text-slate-300 transition-colors hover:text-white"
          >
            Proyectos
          </Link>
          <Link
            href="/projects/new"
            className="text-sm text-slate-300 transition-colors hover:text-white"
          >
            Crear
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="text-sm text-slate-300 max-w-[120px] truncate">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
