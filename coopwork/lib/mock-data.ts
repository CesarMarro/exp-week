export type RoleName = "Diseño" | "Ingeniería" | "Marketing" | "Administración" | "Legal" | "Finanzas"
export type ProjectStatus = "open" | "full" | "closed"
export type ProjectCategory = "Tech" | "Social" | "Fintech" | "Health" | "Education" | "Creative"

export interface MockRole {
  id: string
  role_name: RoleName
  equity_percent: number
  filled_by: string | null
}

export interface MockProject {
  id: string
  title: string
  description: string
  status: ProjectStatus
  category: ProjectCategory
  created_at: string
  roles: MockRole[]
  owner: { full_name: string; career: string; avatar_initials: string }
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "1",
    title: "EcoTrack",
    description: "Plataforma de seguimiento de huella de carbono personal con gamificación y retos comunitarios para fomentar hábitos sostenibles.",
    status: "open",
    category: "Tech",
    created_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    owner: { full_name: "Carlos Mendoza", career: "Emprendedor", avatar_initials: "CM" },
    roles: [
      { id: "1a", role_name: "Ingeniería", equity_percent: 40, filled_by: null },
      { id: "1b", role_name: "Diseño", equity_percent: 35, filled_by: null },
      { id: "1c", role_name: "Marketing", equity_percent: 25, filled_by: null },
    ],
  },
  {
    id: "2",
    title: "MentalFlow",
    description: "App de bienestar mental con meditaciones guiadas, seguimiento de estado emocional y conexión con terapeutas certificados.",
    status: "open",
    category: "Health",
    created_at: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    owner: { full_name: "Laura Vásquez", career: "Psicóloga", avatar_initials: "LV" },
    roles: [
      { id: "2a", role_name: "Ingeniería", equity_percent: 50, filled_by: "laura@example.com" },
      { id: "2b", role_name: "Administración", equity_percent: 30, filled_by: null },
      { id: "2c", role_name: "Diseño", equity_percent: 20, filled_by: null },
    ],
  },
  {
    id: "3",
    title: "FinBuddy",
    description: "Asistente financiero inteligente para jóvenes profesionales que automatiza el ahorro y detecta gastos innecesarios.",
    status: "open",
    category: "Fintech",
    created_at: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    owner: { full_name: "Diego Ramírez", career: "Economista", avatar_initials: "DR" },
    roles: [
      { id: "3a", role_name: "Marketing", equity_percent: 25, filled_by: "mkt@example.com" },
      { id: "3b", role_name: "Ingeniería", equity_percent: 45, filled_by: null },
      { id: "3c", role_name: "Finanzas", equity_percent: 30, filled_by: null },
    ],
  },
  {
    id: "4",
    title: "AgroLink",
    description: "Marketplace que conecta agricultores locales directamente con consumidores urbanos, eliminando intermediarios y reduciendo el desperdicio.",
    status: "open",
    category: "Social",
    created_at: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    owner: { full_name: "María Torres", career: "Agrónoma", avatar_initials: "MT" },
    roles: [
      { id: "4a", role_name: "Ingeniería", equity_percent: 35, filled_by: null },
      { id: "4b", role_name: "Diseño", equity_percent: 25, filled_by: null },
      { id: "4c", role_name: "Marketing", equity_percent: 20, filled_by: null },
      { id: "4d", role_name: "Administración", equity_percent: 20, filled_by: null },
    ],
  },
  {
    id: "5",
    title: "EduFlow",
    description: "Sistema adaptativo de aprendizaje que personaliza el contenido educativo según el ritmo y estilo de cada estudiante.",
    status: "full",
    category: "Education",
    created_at: new Date(Date.now() - 20 * 86_400_000).toISOString(),
    owner: { full_name: "Andrés Fuentes", career: "Pedagogo", avatar_initials: "AF" },
    roles: [
      { id: "5a", role_name: "Ingeniería", equity_percent: 40, filled_by: "ing@example.com" },
      { id: "5b", role_name: "Diseño", equity_percent: 35, filled_by: "dis@example.com" },
      { id: "5c", role_name: "Marketing", equity_percent: 25, filled_by: "mkt@example.com" },
    ],
  },
  {
    id: "6",
    title: "LegalAI",
    description: "Plataforma de asesoría legal automatizada para startups y pymes, con generación de contratos y análisis de riesgos.",
    status: "open",
    category: "Tech",
    created_at: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    owner: { full_name: "Sofía Morales", career: "Abogada", avatar_initials: "SM" },
    roles: [
      { id: "6a", role_name: "Administración", equity_percent: 20, filled_by: "adm@example.com" },
      { id: "6b", role_name: "Ingeniería", equity_percent: 50, filled_by: null },
      { id: "6c", role_name: "Legal", equity_percent: 30, filled_by: null },
    ],
  },
  {
    id: "7",
    title: "ComunidApp",
    description: "Red social hiperlocal para vecinos que facilita la organización comunitaria, reportes ciudadanos y eventos del barrio.",
    status: "closed",
    category: "Social",
    created_at: new Date(Date.now() - 45 * 86_400_000).toISOString(),
    owner: { full_name: "Roberto Castillo", career: "Urbanista", avatar_initials: "RC" },
    roles: [
      { id: "7a", role_name: "Ingeniería", equity_percent: 40, filled_by: "ing@example.com" },
      { id: "7b", role_name: "Diseño", equity_percent: 30, filled_by: "dis@example.com" },
      { id: "7c", role_name: "Marketing", equity_percent: 30, filled_by: "mkt@example.com" },
    ],
  },
  {
    id: "8",
    title: "CreativeHub",
    description: "Ecosistema colaborativo para artistas y creativos donde pueden co-crear proyectos, monetizar su arte y acceder a financiamiento.",
    status: "open",
    category: "Creative",
    created_at: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    owner: { full_name: "Valentina Cruz", career: "Artista", avatar_initials: "VC" },
    roles: [
      { id: "8a", role_name: "Diseño", equity_percent: 50, filled_by: null },
      { id: "8b", role_name: "Marketing", equity_percent: 30, filled_by: null },
      { id: "8c", role_name: "Administración", equity_percent: 20, filled_by: null },
    ],
  },
]

export function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days === 0) return "hoy"
  if (days === 1) return "hace 1 día"
  if (days < 30) return `hace ${days} días`
  return "hace más de un mes"
}
