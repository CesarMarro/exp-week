"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const [profile, setProfile] = useState<{ full_name: string | null; career: string | null; bio: string | null } | null>(null)
  const [careers, setCareers] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [edit, setEdit] = useState({ full_name: "", career: "", bio: "" })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) {
        router.push("/login")
        return
      }
      setUser(u)

      const { data: p } = await supabase.from("profiles").select("full_name, career, bio").eq("id", u.id).single()
      setProfile(p ?? null)
      setEdit({
        full_name: p?.full_name ?? u.user_metadata?.full_name ?? "",
        career: p?.career ?? "",
        bio: p?.bio ?? "",
      })

      const { data: c } = await supabase.from("careers").select("id, name").order("display_order")
      setCareers(c ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from("profiles").update({
      full_name: edit.full_name || null,
      career: edit.career || null,
      bio: edit.bio || null,
    }).eq("id", user.id)
    setProfile({ ...profile!, full_name: edit.full_name, career: edit.career, bio: edit.bio })
    setSaving(false)
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="mx-auto max-w-xl px-6">
        <Link href="/projects" className="text-sm text-slate-500 hover:text-slate-300">
          ← Volver
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-white">Mi perfil</h1>

        <form onSubmit={handleSave} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nombre</label>
            <input
              type="text"
              value={edit.full_name}
              onChange={(e) => setEdit((s) => ({ ...s, full_name: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Carrera</label>
            <select
              value={edit.career}
              onChange={(e) => setEdit((s) => ({ ...s, career: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white"
            >
              <option value="">Sin especificar</option>
              {careers.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Bio</label>
            <textarea
              value={edit.bio}
              onChange={(e) => setEdit((s) => ({ ...s, bio: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  )
}
