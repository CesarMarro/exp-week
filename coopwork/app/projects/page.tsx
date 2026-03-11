"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { fetchProjectsWithRoles, type ProjectWithRoles } from "@/lib/supabase-queries"
import { cn } from "@/lib/utils"
import { staggerContainer } from "@/lib/animations"
import ProjectCard from "@/components/ProjectCard"

type StatusFilter = "all" | ProjectWithRoles["status"]
type RoleName = string
type ProjectCategory = string

interface Filters {
  search: string
  status: StatusFilter
  roles: Set<RoleName>
  categories: Set<ProjectCategory>
}

const ALL_ROLES: RoleName[] = ["Diseño", "Ingeniería", "Marketing", "Administración", "Legal", "Finanzas"]
const ALL_CATEGORIES: ProjectCategory[] = ["Tech", "Social", "Fintech", "Health", "Education", "Creative"]
const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all",    label: "Todos"   },
  { value: "open",   label: "Abiertos" },
  { value: "full",   label: "Llenos"  },
  { value: "closed", label: "Cerrados" },
]

interface FilterSidebarProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  activeFilterCount: number
}

function FilterSidebar({ filters, setFilters, activeFilterCount }: FilterSidebarProps) {
  function toggleRole(role: RoleName) {
    setFilters((prev) => {
      const next = new Set(prev.roles)
      if (next.has(role)) next.delete(role); else next.add(role)
      return { ...prev, roles: next }
    })
  }

  function toggleCategory(cat: ProjectCategory) {
    setFilters((prev) => {
      const next = new Set(prev.categories)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return { ...prev, categories: next }
    })
  }

  return (
    <aside className="w-52 shrink-0 space-y-7 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between h-5">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Filtros</span>
        {activeFilterCount > 0 && (
          <button
            onClick={() => setFilters({ search: "", status: "all", roles: new Set(), categories: new Set() })}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <p className="text-[11px] text-slate-600 uppercase tracking-wider">Estado</p>
        <div className="space-y-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters((prev) => ({ ...prev, status: opt.value }))}
              className={cn(
                "block w-full text-left text-sm py-1 px-2 rounded-lg transition-colors",
                filters.status === opt.value
                  ? "text-slate-100 bg-slate-800"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Área */}
      <div className="space-y-2">
        <p className="text-[11px] text-slate-600 uppercase tracking-wider">Área</p>
        <div className="space-y-1">
          {ALL_ROLES.map((role) => (
            <label
              key={role}
              className="flex items-center gap-2.5 py-1 px-2 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors group"
            >
              <span
                className={cn(
                  "h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 transition-colors",
                  filters.roles.has(role)
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-slate-700 group-hover:border-slate-600"
                )}
              >
                {filters.roles.has(role) && (
                  <svg viewBox="0 0 8 8" className="h-2 w-2 fill-white">
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
                filters.roles.has(role) ? "text-slate-200" : "text-slate-500 group-hover:text-slate-400"
              )}>
                {role}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <p className="text-[11px] text-slate-600 uppercase tracking-wider">Categoría</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs transition-colors",
                filters.categories.has(cat)
                  ? "bg-slate-700 text-slate-200"
                  : "text-slate-600 hover:text-slate-400"
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
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <p className="text-slate-600 text-sm">No hay proyectos con esos filtros.</p>
      <button
        onClick={onReset}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4"
      >
        Limpiar filtros
      </button>
    </div>
  )
}

export default function ProjectsPage() {
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
    <div className="min-h-screen bg-slate-950 pt-16">

      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/60">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && (
              <span className="text-xs text-indigo-400">({activeFilterCount})</span>
            )}
          </button>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar proyectos..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 py-2 pl-8 pr-4 text-sm text-slate-300 placeholder-slate-600 outline-none transition focus:border-slate-700 focus:bg-slate-900"
            />
          </div>

          {/* Create */}
          <Link
            href="/projects/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            Nuevo proyecto
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-8">

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Mobile drawer */}
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
                className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-slate-950 border-r border-slate-800 px-6 py-8 lg:hidden"
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

        {/* Grid */}
        <main className="flex-1 min-w-0">
          <p className="mb-5 text-xs text-slate-600">
            {loading ? "Cargando..." : `${filtered.length} proyecto${filtered.length !== 1 ? "s" : ""}`}
          </p>

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

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-slate-200"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
