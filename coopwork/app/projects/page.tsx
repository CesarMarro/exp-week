"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { staggerContainer } from "@/lib/animations"
import {
  MOCK_PROJECTS,
  type RoleName,
  type ProjectCategory,
  type ProjectStatus,
} from "@/lib/mock-data"
import ProjectCard from "@/components/ProjectCard"

type StatusFilter = "all" | ProjectStatus

interface Filters {
  search: string
  status: StatusFilter
  roles: Set<RoleName>
  categories: Set<ProjectCategory>
}

const ALL_ROLES: RoleName[] = ["Diseño", "Ingeniería", "Marketing", "Administración", "Legal", "Finanzas"]
const ALL_CATEGORIES: ProjectCategory[] = ["Tech", "Social", "Fintech", "Health", "Education", "Creative"]
const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Abierto" },
  { value: "full", label: "Lleno" },
  { value: "closed", label: "Cerrado" },
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

  function clearAll() {
    setFilters({ search: "", status: "all", roles: new Set(), categories: new Set() })
  }

  return (
    <aside className="w-60 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Filtros</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="rounded-md border border-slate-700 px-2 py-0.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Limpiar ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Status */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Estado</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters((prev) => ({ ...prev, status: opt.value }))}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filters.status === opt.value
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Área / Rol</p>
        <div className="space-y-1.5">
          {ALL_ROLES.map((role) => (
            <label key={role} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={filters.roles.has(role)}
                onChange={() => toggleRole(role)}
                className="h-3.5 w-3.5 rounded accent-indigo-500"
              />
              <span className="text-sm text-slate-400 hover:text-white transition-colors">{role}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Categoría</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filters.categories.has(cat)
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
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
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl mb-4">🔍</span>
      <h3 className="text-lg font-semibold text-white mb-2">Sin resultados</h3>
      <p className="text-sm text-slate-400 mb-6">No encontramos proyectos con esos filtros.</p>
      <button
        onClick={onReset}
        className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  )
}

export default function ProjectsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    roles: new Set(),
    categories: new Set(),
  })
  const [joinedRoles, setJoinedRoles] = useState<Set<string>>(new Set())
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const activeFilterCount =
    (filters.status !== "all" ? 1 : 0) + filters.roles.size + filters.categories.size

  const filtered = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false
      }
      if (filters.status !== "all" && p.status !== filters.status) return false
      if (filters.roles.size > 0) {
        const hasAvailable = p.roles.some(
          (r) => r.filled_by === null && filters.roles.has(r.role_name)
        )
        if (!hasAvailable) return false
      }
      if (filters.categories.size > 0 && !filters.categories.has(p.category)) return false
      return true
    })
  }, [filters])

  function handleJoin(projectId: string, roleId: string) {
    setJoinedRoles((prev) => new Set([...prev, roleId]))
    setToastMessage("¡Te uniste al proyecto!")
    setTimeout(() => setToastMessage(""), 2500)
  }

  function resetFilters() {
    setFilters({ search: "", status: "all", roles: new Set(), categories: new Set() })
  }

  const gridKey = filtered.map((p) => p.id).join("-")

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Sticky top bar */}
      <div className="sticky top-16 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors lg:hidden"
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs text-white leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar proyectos..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <Link
            href="/projects/new"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            + Crear proyecto
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} activeFilterCount={activeFilterCount} />
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
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              />
              <motion.div
                key="drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-slate-900 p-6 lg:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-white">Filtros</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <FilterSidebar filters={filters} setFilters={setFilters} activeFilterCount={activeFilterCount} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main grid */}
        <main className="flex-1 min-w-0">
          <p className="mb-5 text-sm text-slate-500">
            {filtered.length} proyecto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <motion.div
              key={gridKey}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-xl shadow-indigo-500/20"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
