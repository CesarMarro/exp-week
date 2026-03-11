"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Search, X, SlidersHorizontal, FolderOpen, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { fetchProjectsWithRoles, type ProjectWithRoles } from "@/lib/supabase-queries"
import { cn } from "@/lib/utils"
import { staggerContainer } from "@/lib/animations"
import ProjectCard from "@/components/ProjectCard"
import type { ProjectCategory } from "@/lib/mock-data"

type StatusFilter = "all" | ProjectWithRoles["status"]

interface Filters {
  search: string
  status: StatusFilter
  roles: Set<string>
  categories: Set<string>
}

const ALL_ROLES = ["Diseño", "Ingeniería", "Marketing", "Administración", "Legal", "Finanzas"]
const ALL_CATEGORIES: ProjectCategory[] = ["Tech", "Social", "Fintech", "Health", "Education", "Creative"]
const STATUS_OPTIONS: { value: StatusFilter; label: string; color: string }[] = [
  { value: "all",    label: "Todos",    color: "from-slate-600 to-slate-700" },
  { value: "open",   label: "Abiertos",  color: "from-emerald-600 to-emerald-700" },
  { value: "full",   label: "Llenos",    color: "from-amber-600 to-amber-700" },
  { value: "closed", label: "Cerrados",  color: "from-slate-500 to-slate-600" },
]

interface FilterSidebarProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  activeFilterCount: number
}

function FilterSidebar({ filters, setFilters, activeFilterCount }: FilterSidebarProps) {
  function toggleRole(role: string) {
    setFilters((prev) => {
      const next = new Set(prev.roles)
      if (next.has(role)) next.delete(role); else next.add(role)
      return { ...prev, roles: next }
    })
  }

  function toggleCategory(cat: string) {
    setFilters((prev) => {
      const next = new Set(prev.categories)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return { ...prev, categories: next }
    })
  }

  return (
    <aside className="w-56 shrink-0 space-y-7 pt-1">
      <div className="flex items-center justify-between h-5">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal size={12} className="text-indigo-400" />
          Filtros
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={() => setFilters({ search: "", status: "all", roles: new Set(), categories: new Set() })}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Estado</p>
        <div className="space-y-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters((prev) => ({ ...prev, status: opt.value }))}
              className={cn(
                "block w-full text-left text-sm py-2 px-3 rounded-xl transition-all duration-200",
                filters.status === opt.value
                  ? `text-white bg-gradient-to-r ${opt.color} shadow-lg shadow-black/20`
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Área</p>
        <div className="space-y-1">
          {ALL_ROLES.map((role) => (
            <label
              key={role}
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all group"
            >
              <span
                className={cn(
                  "h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-all",
                  filters.roles.has(role)
                    ? "bg-indigo-500 border-indigo-400 shadow-sm shadow-indigo-500/30"
                    : "border-slate-600 group-hover:border-slate-500"
                )}
              >
                {filters.roles.has(role) && (
                  <svg viewBox="0 0 8 8" className="h-2.5 w-2.5 fill-white">
                    <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.roles.has(role)}
                onChange={() => toggleRole(role)}
              />
              <span className={cn(
                "text-sm transition-colors",
                filters.roles.has(role) ? "text-slate-100 font-medium" : "text-slate-500 group-hover:text-slate-400"
              )}>
                {role}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Categoría</p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
                filters.categories.has(cat)
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-1 ring-inset"
                  : "text-slate-600 border-slate-700/60 hover:text-slate-400 hover:border-slate-600"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-6"
    >
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-8 max-w-sm">
        <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center mb-4">
          <FolderOpen className="w-7 h-7 text-indigo-400" />
        </div>
        <p className="text-slate-300 font-medium mb-1">No hay proyectos con esos filtros</p>
        <p className="text-slate-500 text-sm mb-5">Prueba ajustando los filtros para ver más opciones</p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors"
        >
          <Sparkles size={14} />
          Limpiar filtros
        </button>
      </div>
    </motion.div>
  )
}

export default function ProjectsFeedPage() {
  const [projects, setProjects] = useState<ProjectWithRoles[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    roles: new Set(),
    categories: new Set(),
  })
  const [joinedRoles, setJoinedRoles] = useState<Set<string>>(new Set())
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const data = await fetchProjectsWithRoles(supabase)
      setProjects(data)
      setLoading(false)
    }
    load()
  }, [])

  const activeFilterCount =
    (filters.status !== "all" ? 1 : 0) + filters.roles.size + filters.categories.size

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false
      }
      if (filters.status !== "all" && p.status !== filters.status) return false
      if (filters.roles.size > 0) {
        const has = p.roles.some((r) => r.filled_by === null && filters.roles.has(r.role_name))
        if (!has) return false
      }
      if (filters.categories.size > 0 && !filters.categories.has(p.category)) return false
      return true
    })
  }, [projects, filters])

  async function handleJoin(projectId: string, roleId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setToastMessage("Inicia sesión para unirte")
      setTimeout(() => setToastMessage(""), 2500)
      return
    }
    const { error } = await import("@/lib/supabase-queries").then((m) =>
      m.joinRole(supabase, roleId, user.id)
    )
    if (error) {
      setToastMessage(error)
      setTimeout(() => setToastMessage(""), 2500)
      return
    }
    setJoinedRoles((prev) => new Set([...prev, roleId]))
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        const newRoles = p.roles.map((r) =>
          r.id === roleId ? { ...r, filled_by: user.id } : r
        )
        return {
          ...p,
          roles: newRoles,
          status: newRoles.every((r) => r.filled_by) ? ("full" as const) : p.status,
        }
      })
    )
    setToastMessage("Te uniste al proyecto")
    setTimeout(() => setToastMessage(""), 2500)
  }

  function resetFilters() {
    setFilters({ search: "", status: "all", roles: new Set(), categories: new Set() })
  }

  const gridKey = filtered.map((p) => p.id).join("-")

  return (
    <div className="min-h-screen bg-slate-950 pt-16 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/6 blur-[80px]" />
      </div>

      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition-colors px-3 py-2 rounded-xl hover:bg-slate-800/60"
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && (
              <span className="text-xs font-medium text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded-md">({activeFilterCount})</span>
            )}
          </button>

          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar proyectos..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-300 placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <Link
            href="/projects/new"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25 whitespace-nowrap"
          >
            Nuevo proyecto
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 mx-auto flex max-w-6xl gap-10 px-6 py-8">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              />
              <motion.div
                key="drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-slate-950 border-r border-slate-800 px-6 py-8 lg:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-slate-300">Filtros</span>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-600 hover:text-slate-400">
                    <X size={16} />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  activeFilterCount={activeFilterCount}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {loading ? "Cargando..." : (
                <>
                  <span className="font-semibold text-slate-300">{filtered.length}</span> proyecto{filtered.length !== 1 ? "s" : ""}
                </>
              )}
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Cargando proyectos...</div>
          ) : filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <motion.div
              key={gridKey}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onJoin={handleJoin}
                  joinedRoles={joinedRoles}
                />
              ))}
            </motion.div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-sm text-slate-200 shadow-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
