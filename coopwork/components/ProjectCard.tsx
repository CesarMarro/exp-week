"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import EquityBadge from "@/components/EquityBadge"
import { relativeDate, type MockProject } from "@/lib/mock-data"
import { fadeUp } from "@/lib/animations"

interface ProjectCardProps {
  project: MockProject
  onJoin: (projectId: string, roleId: string) => void
  joinedRoles: Set<string>
}

const CATEGORY_COLORS: Record<string, string> = {
  Tech: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30",
  Social: "bg-green-500/20 text-green-300 ring-1 ring-green-500/30",
  Fintech: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
  Health: "bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/30",
  Education: "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30",
  Creative: "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30",
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  open: { label: "Abierto", cls: "bg-green-500/20 text-green-300 ring-1 ring-green-500/30" },
  full: { label: "Lleno", cls: "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30" },
  closed: { label: "Cerrado", cls: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30" },
}

const EQUITY_COLORS = ["bg-indigo-500", "bg-violet-500", "bg-blue-400", "bg-purple-500"]

export default function ProjectCard({ project, onJoin, joinedRoles }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status]

  return (
    <motion.article
      variants={fadeUp}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition-colors flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", CATEGORY_COLORS[project.category])}>
          {project.category}
        </span>
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", status.cls)}>
          {status.label}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-bold text-white text-lg leading-tight mb-1">{project.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
      </div>

      {/* Owner */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white">
          {project.owner.avatar_initials}
        </div>
        <span className="text-xs text-slate-400">
          {project.owner.full_name} · {project.owner.career}
        </span>
      </div>

      {/* Roles */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Roles</p>
        <div className="flex flex-wrap gap-2">
          {project.roles.map((role) => {
            if (role.filled_by !== null) {
              return (
                <span
                  key={role.id}
                  className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-500 line-through"
                >
                  {role.role_name} {role.equity_percent}%
                </span>
              )
            }
            if (joinedRoles.has(role.id)) {
              return (
                <span
                  key={role.id}
                  className="rounded-full border border-indigo-500/50 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300"
                >
                  Unido · {role.role_name} {role.equity_percent}%
                </span>
              )
            }
            return (
              <div key={role.id} className="flex flex-col items-start gap-1">
                <EquityBadge percentage={role.equity_percent} label={role.role_name} />
                {project.status === "open" && (
                  <button
                    onClick={() => onJoin(project.id, role.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors px-1"
                  >
                    Unirse
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Equity bar */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Distribución equity</p>
        <div className="flex h-2 w-full overflow-hidden rounded-full gap-px">
          {project.roles.map((role, i) => (
            <div
              key={role.id}
              style={{ width: `${role.equity_percent}%` }}
              className={cn(
                "h-full",
                role.filled_by !== null ? "bg-slate-700" : EQUITY_COLORS[i % EQUITY_COLORS.length]
              )}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Ver proyecto →
        </Link>
        <span className="text-xs text-slate-600">{relativeDate(project.created_at)}</span>
      </div>
    </motion.article>
  )
}
