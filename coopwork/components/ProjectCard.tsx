"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { relativeDate, type MockProject } from "@/lib/mock-data"

interface ProjectCardProps {
  project: MockProject
  onJoin: (projectId: string, roleId: string) => void
  joinedRoles: Set<string>
}

const STATUS_DOT: Record<string, string> = {
  open:   "bg-emerald-400",
  full:   "bg-amber-400",
  closed: "bg-slate-500",
}

const STATUS_LABEL: Record<string, string> = {
  open:   "Abierto",
  full:   "Lleno",
  closed: "Cerrado",
}

const EQUITY_COLORS = ["bg-indigo-400", "bg-violet-400", "bg-sky-400", "bg-purple-400"]

export default function ProjectCard({ project, onJoin, joinedRoles }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)

  const availableRoles = project.roles.filter(
    (r) => r.filled_by === null && !joinedRoles.has(r.id)
  )
  const joinedInProject = project.roles.filter((r) => joinedRoles.has(r.id))

  return (
    <motion.article
      variants={{
        hidden:  { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
      }}
      className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col gap-3.5 hover:border-slate-700/80 transition-colors"
    >
      {/* Row: status dot + date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[project.status])} />
          <span className="text-xs text-slate-500">{STATUS_LABEL[project.status]}</span>
        </div>
        <span className="text-[11px] text-slate-600">{relativeDate(project.created_at)}</span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-slate-100 text-[15px] leading-snug mb-1">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Owner */}
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-semibold text-slate-300 shrink-0">
          {project.owner.avatar_initials}
        </span>
        <span className="text-xs text-slate-500 truncate">{project.owner.full_name}</span>
        <span className="text-slate-700 text-xs">·</span>
        <span className="text-xs text-slate-600 truncate">{project.category}</span>
      </div>

      {/* Roles toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span
          className={cn(
            "text-xs font-medium",
            availableRoles.length > 0
              ? "text-indigo-400"
              : joinedInProject.length > 0
              ? "text-emerald-400"
              : "text-slate-600"
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
          className="text-slate-600 group-hover:text-slate-400 transition-colors"
        >
          <ChevronDown size={13} />
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
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium shrink-0 ml-2"
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
              <div className="flex items-center justify-end pt-0.5">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Ver proyecto →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
