import type { SupabaseClient } from "@supabase/supabase-js"

export type ProjectStatus = "open" | "full" | "closed"

export interface ProjectRole {
  id: string
  role_name: string
  equity_percent: number
  filled_by: string | null
  filler_name?: string
}

export interface ProjectWithRoles {
  id: string
  title: string
  description: string
  status: ProjectStatus
  category: string
  created_at: string
  roles: ProjectRole[]
  owner: { full_name: string; career: string; avatar_initials: string }
}

/** Obtiene proyectos con roles y owner. Usar desde Client Components con createClient(). */
export async function fetchProjectsWithRoles(
  supabase: SupabaseClient
): Promise<ProjectWithRoles[]> {
  const { data: projects, error: projErr } = await supabase
    .from("projects")
    .select("id, title, description, status, created_at, owner_id")
    .order("created_at", { ascending: false })

  if (projErr || !projects?.length) return []

  const ownerIds = [...new Set(projects.map((p: { owner_id: string }) => p.owner_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, career")
    .in("id", ownerIds)

  const profileMap = new Map<string, { id: string; full_name: string | null; career: string | null }>(
    (profiles ?? []).map((p: { id: string; full_name: string | null; career: string | null }) => [p.id, p])
  )

  const { data: roles } = await supabase
    .from("project_roles")
    .select("id, project_id, role_name, equity_percent, filled_by")
    .in("project_id", projects.map((p) => p.id))

  type RoleRow = { id: string; project_id: string; role_name: string; equity_percent: number; filled_by: string | null }
  const rolesByProject = new Map<string, RoleRow[]>()
  for (const r of (roles ?? []) as RoleRow[]) {
    const list = rolesByProject.get(r.project_id) ?? []
    list.push(r)
    rolesByProject.set(r.project_id, list)
  }

  return projects.map((p: { id: string; title: string; description: string | null; status: string; created_at: string; owner_id: string }) => {
    const owner = profileMap.get(p.owner_id)
    const ownerName = owner?.full_name ?? "Usuario"
    const initials = ownerName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    return {
      id: p.id,
      title: p.title,
      description: p.description ?? "",
      status: p.status as ProjectStatus,
      category: "Tech",
      created_at: p.created_at,
      roles: (rolesByProject.get(p.id) ?? []).map((r: RoleRow) => ({
        id: r.id,
        role_name: r.role_name,
        equity_percent: Number(r.equity_percent),
        filled_by: r.filled_by,
      })),
      owner: {
        full_name: ownerName,
        career: owner?.career ?? "",
        avatar_initials: initials || "U",
      },
    }
  })
}

/** Obtiene un proyecto por ID con roles y owner. */
export async function fetchProjectById(
  supabase: SupabaseClient,
  projectId: string
): Promise<ProjectWithRoles | null> {
  const { data: project, error: projErr } = await supabase
    .from("projects")
    .select("id, title, description, status, created_at, owner_id")
    .eq("id", projectId)
    .single()

  if (projErr || !project) return null

  const { data: owner } = await supabase
    .from("profiles")
    .select("full_name, career")
    .eq("id", project.owner_id)
    .single()

  const ownerName = owner?.full_name ?? "Usuario"
  const initials = ownerName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const { data: roles } = await supabase
    .from("project_roles")
    .select("id, project_id, role_name, equity_percent, filled_by")
    .eq("project_id", projectId)

  const fillerIds = [...new Set((roles ?? []).map((r: { filled_by: string | null }) => r.filled_by).filter(Boolean) as string[])]
  const { data: fillerProfiles } = fillerIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", fillerIds)
    : { data: [] }
  const fillerMap = new Map((fillerProfiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name]))

  return {
    id: project.id,
    title: project.title,
    description: project.description ?? "",
    status: project.status as ProjectStatus,
    category: "Tech",
    created_at: project.created_at,
    roles: (roles ?? []).map((r: { id: string; role_name: string; equity_percent: number; filled_by: string | null }) => ({
      id: r.id,
      role_name: r.role_name,
      equity_percent: Number(r.equity_percent),
      filled_by: r.filled_by,
      filler_name: r.filled_by ? (fillerMap.get(r.filled_by) ?? undefined) : undefined,
    })),
    owner: {
      full_name: ownerName,
      career: owner?.career ?? "",
      avatar_initials: initials || "U",
    },
  }
}

/** Unirse a un rol. Devuelve error si falla. */
export async function joinRole(
  supabase: SupabaseClient,
  roleId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { data: role, error: fetchErr } = await supabase
    .from("project_roles")
    .select("id, project_id, filled_by")
    .eq("id", roleId)
    .single()

  if (fetchErr || !role) return { error: "Rol no encontrado" }
  if (role.filled_by) return { error: "Este rol ya está ocupado" }

  const { error: updateErr } = await supabase
    .from("project_roles")
    .update({ filled_by: userId })
    .eq("id", roleId)

  if (updateErr) return { error: updateErr.message }

  const { data: remaining } = await supabase
    .from("project_roles")
    .select("id")
    .eq("project_id", role.project_id)
    .is("filled_by", null)

  if (!remaining?.length) {
    await supabase
      .from("projects")
      .update({ status: "full" })
      .eq("id", role.project_id)
  }

  return { error: null }
}
