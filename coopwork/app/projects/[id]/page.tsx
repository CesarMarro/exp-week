"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { fetchProjectById, joinRole, type ProjectWithRoles } from "@/lib/supabase-queries"
import { relativeDate } from "@/lib/mock-data"

const STATUS_LABEL: Record<string, string> = {
  open: "Abierto",
  full: "Lleno",
  closed: "Cerrado",
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [project, setProject] = useState<ProjectWithRoles | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const data = await fetchProjectById(supabase, id)
      setProject(data)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleJoin(roleId: string) {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    setJoining(roleId)
    setError("")
    const { error: err } = await joinRole(supabase, roleId, user.id)
    setJoining(null)
    if (err) {
      setError(err)
      return
    }
    const updated = await fetchProjectById(supabase, id)
    setProject(updated)
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    )

  if (!project)
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Proyecto no encontrado</p>
        <Link href="/projects" className="text-indigo-400 hover:text-indigo-300">
          Volver a proyectos
        </Link>
      </div>
    )

  const availableRoles = project.roles.filter((r) => !r.filled_by)

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/projects"
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Volver a proyectos
        </Link>

        <div className="mt-8 rounded-2xl bg-slate-900/60 border border-slate-800 p-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.status === "open"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : project.status === "full"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-slate-500/20 text-slate-400"
              }`}
            >
              {STATUS_LABEL[project.status]}
            </span>
            <span className="text-xs text-slate-600">
              {relativeDate(project.created_at)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {project.description || "Sin descripción."}
          </p>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {project.owner.avatar_initials}
            </span>
            <span className="text-slate-300">{project.owner.full_name}</span>
            {project.owner.career && (
              <span className="text-slate-600">· {project.owner.career}</span>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">
              Roles y equity
            </h2>
            <div className="space-y-3">
              {project.roles.map((role) => {
                const isFilled = !!role.filled_by
                const isJoining = joining === role.id

                return (
                  <div
                    key={role.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-sm ${
                          isFilled ? "text-slate-500 line-through" : "text-slate-200"
                        }`}
                      >
                        {role.role_name}
                      </span>
                      <span className="text-xs text-slate-600 shrink-0">
                        {role.equity_percent}%
                      </span>
                      {role.filler_name && (
                        <span className="text-xs text-emerald-400 truncate">
                          → {role.filler_name}
                        </span>
                      )}
                    </div>
                    {!isFilled && project.status === "open" && (
                      <button
                        onClick={() => handleJoin(role.id)}
                        disabled={isJoining}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium shrink-0 disabled:opacity-50"
                      >
                        {isJoining ? "Uniendo..." : "Unirse"}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full gap-px">
              {project.roles.map((role, i) => (
                <div
                  key={role.id}
                  style={{ width: `${role.equity_percent}%` }}
                  className={`h-full rounded-full ${
                    role.filled_by ? "bg-slate-600" : "bg-indigo-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
