import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
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
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
