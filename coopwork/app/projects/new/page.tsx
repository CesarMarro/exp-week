"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Plus, Trash2 } from "lucide-react"

const COMMON_ROLES = ["Ingeniería", "Diseño", "Marketing", "Administración", "Finanzas", "Legal"]

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [roles, setRoles] = useState<{ role_name: string; equity_percent: number }[]>([
    { role_name: "Ingeniería", equity_percent: 40 },
    { role_name: "Diseño", equity_percent: 35 },
    { role_name: "Marketing", equity_percent: 25 },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) router.push("/login")
      })
  }, [router])

  function addRole() {
    setRoles((prev) => [...prev, { role_name: "", equity_percent: 0 }])
  }

  function removeRole(i: number) {
    setRoles((prev) => prev.filter((_, j) => j !== i))
  }

  function updateRole(i: number, field: "role_name" | "equity_percent", value: string | number) {
    setRoles((prev) =>
      prev.map((r, j) => (j === i ? { ...r, [field]: value } : r))
    )
  }

  const total = roles.reduce((s, r) => s + r.equity_percent, 0)
  const isValid = total === 100 && roles.every((r) => r.role_name.trim() && r.equity_percent > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError("")
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError("Debes iniciar sesión")
      setLoading(false)
      return
    }

    const { data: project, error: insertErr } = await supabase
      .from("projects")
      .insert({
        owner_id: user.id,
        title,
        description,
        status: "open",
      })
      .select("id")
      .single()

    if (insertErr) {
      setError(insertErr.message)
      setLoading(false)
      return
    }

    const rolesToInsert = roles.map((r) => ({
      project_id: project.id,
      role_name: r.role_name.trim(),
      equity_percent: r.equity_percent,
    }))

    const { error: rolesErr } = await supabase.from("project_roles").insert(rolesToInsert)

    if (rolesErr) {
      setError(rolesErr.message)
      setLoading(false)
      return
    }

    router.push(`/projects/${project.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="mx-auto max-w-xl px-6">
        <Link
          href="/projects"
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Volver a proyectos
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-white">Crear proyecto</h1>
        <p className="mt-1 text-sm text-slate-500">
          Define el título, descripción y roles con % de equity (debe sumar 100%).
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Título
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: EcoTrack"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el proyecto..."
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">
                Roles y equity (%)
              </label>
              <span
                className={`text-xs ${total === 100 ? "text-emerald-400" : "text-amber-400"}`}
              >
                Total: {total}%
              </span>
            </div>
            <div className="space-y-3">
              {roles.map((r, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-center"
                >
                  <select
                    value={r.role_name}
                    onChange={(e) => updateRole(i, "role_name", e.target.value)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="">Elegir rol</option>
                    {COMMON_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={r.equity_percent || ""}
                    onChange={(e) =>
                      updateRole(i, "equity_percent", Number(e.target.value) || 0)
                    }
                    className="w-20 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white text-right outline-none focus:border-indigo-500"
                    placeholder="%"
                  />
                  <span className="text-slate-500 text-sm">%</span>
                  {roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRole(i)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      aria-label="Quitar rol"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRole}
                className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus size={14} />
                Agregar rol
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !isValid}
              className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creando..." : "Crear proyecto"}
            </button>
            <Link
              href="/projects"
              className="rounded-xl border border-slate-600 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
