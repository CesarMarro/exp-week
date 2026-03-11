"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { relativeDate } from "@/lib/mock-data"
import type { ProjectWithRoles } from "@/lib/supabase-queries"
import type { ProjectCategory } from "@/lib/mock-data"

interface ProjectCardProps {
  project: ProjectWithRoles
  onJoin: (projectId: string, roleId: string) => void
  joinedRoles: Set<string>
}

const STATUS_STYLES: Record<string, { dot: string; label: string; pill: string }> = {
  open:   { dot: "bg-emerald-400", label: "Abierto", pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  full:   { dot: "bg-amber-400", label: "Lleno", pill: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  closed: { dot: "bg-slate-500", label: "Cerrado", pill: "bg-slate-500/20 text-slate-400 border-slate-500/40" },
}

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  Tech:      "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  Social:    "bg-violet-500/20 text-violet-300 border-violet-500/40",
  Fintech:   "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Health:    "bg-rose-500/20 text-rose-300 border-rose-500/40",
  Education: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  Creative:  "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
}

const EQUITY_COLORS = ["bg-indigo-400", "bg-violet-400", "bg-sky-400", "bg-fuchsia-400"]

export default function ProjectCard({ project, onJoin, joinedRoles }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)

  const availableRoles = project.roles.filter(
    (r) => r.filled_by === null && !joinedRoles.has(r.id)
  )
  const joinedInProject = project.roles.filter((r) => joinedRoles.has(r.id))

  const statusStyle = STATUS_STYLES[project.status] ?? STATUS_STYLES.closed
  const categoryStyle = CATEGORY_COLORS[project.category as ProjectCategory] ?? CATEGORY_COLORS.Tech

  return (
    <motion.article
      variants={{
        hidden:  { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
      }}
      className="group rounded-2xl bg-slate-900/70 border border-slate-800 p-5 flex flex-col gap-3.5 hover:border-slate-600/80 hover:bg-slate-900/90 transition-all duration-200"
    >
      {/* Row: status pill + category + date */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
            statusStyle.pill
          )}>
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusStyle.dot)} />
            {statusStyle.label}
          </span>
          <span className={cn(
            "rounded-full border px-2 py-0.5 text-[11px] font-medium",
            categoryStyle
          )}>
            {project.category}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">{relativeDate(project.created_at)}</span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-slate-100 text-[15px] leading-snug mb-1 group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Owner */}
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border border-indigo-500/30 flex items-center justify-center text-[10px] font-semibold text-indigo-200 shrink-0">
          {project.owner.avatar_initials}
        </span>
        <span className="text-xs text-slate-400 truncate">{project.owner.full_name}</span>
      </div>

      {/* Roles toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left py-2 px-3 rounded-xl -mx-1 hover:bg-slate-800/50 transition-colors"
      >
        <span
          className={cn(
            "text-xs font-semibold",
            availableRoles.length > 0
              ? "text-indigo-400"
              : joinedInProject.length > 0
              ? "text-emerald-400"
              : "text-slate-500"
          )}
        >
          {availableRoles.length > 0
            ? `${availableRoles.length} rol${availableRoles.length !== 1 ? "es" : ""} disponible${availableRoles.length !== 1 ? "s" : ""}`
            : joinedInProject.length > 0
            ? "Ya estás en este proyecto"
            : "Sin roles disponibles"}
        </span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500 group-hover:text-slate-300 transition-colors"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-800 pt-3.5 space-y-3">
              {/* Roles list */}
              <div className="space-y-2">
                {project.roles.map((role) => {
                  const isFilled = role.filled_by !== null
                  const isJoined = joinedRoles.has(role.id)

                  return (
                    <div key={role.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "text-sm truncate",
                            isFilled
                              ? "text-slate-600 line-through"
                              : isJoined
                              ? "text-emerald-400"
                              : "text-slate-300"
                          )}
                        >
                          {role.role_name}
                        </span>
                        <span className="text-xs text-slate-600 shrink-0">
                          {role.equity_percent}%
                        </span>
                      </div>

                      {!isFilled && !isJoined && project.status === "open" && (
                        <button
                          onClick={() => onJoin(project.id, role.id)}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors shrink-0 ml-2"
                        >
                          Unirse
                        </button>
                      )}
                      {isJoined && (
                        <span className="text-xs text-emerald-400/60 shrink-0 ml-2">✓</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Equity bar */}
              <div className="flex h-1 w-full overflow-hidden rounded-full gap-px">
                {project.roles.map((role, i) => (
                  <div
                    key={role.id}
                    style={{ width: `${role.equity_percent}%` }}
                    className={cn(
                      "h-full rounded-full",
                      role.filled_by !== null ? "bg-slate-700" : EQUITY_COLORS[i % EQUITY_COLORS.length]
                    )}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end pt-1">
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Ver proyecto
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
