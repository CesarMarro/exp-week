/**
 * Contenido de la landing page.
 * Edita aquí todos los textos que se muestran en la home.
 */

export const hero = {
  flag: "100% Justos · Sin Sorpresas",
  headlineStart: "Construye proyectos reales.",
  headlineEnd: "Reparte ganancias con justicia.",
  description:
    "CoopWork conecta personas con habilidades complementarias para construir productos colaborativos, con reparto de equity transparente desde el primer día.",
  ctaPrimary: "Ver proyectos",
  ctaSecondary: "Crear proyecto",
} as const;

export const stats = [
  { value: 500, suffix: "+", label: "Proyectos creados", emoji: "🚀" },
  { value: 1200, suffix: "+", label: "Colaboradores activos", emoji: "🤝" },
  { value: 38, suffix: "", label: "Países representados", emoji: "🌎" },
  { value: 92, suffix: "%", label: "Satisfacción del equipo", emoji: "⭐" },
] as const;

export const howItWorks = {
  title: "¿Cómo funciona?",
  steps: [
    {
      number: 1,
      icon: "🚀",
      title: "Crea tu proyecto",
      description:
        "Define tu idea, las habilidades que necesitas y cómo se repartirá el equity entre colaboradores.",
    },
    {
      number: 2,
      icon: "🤝",
      title: "Únete a un equipo",
      description:
        "Explora proyectos activos, aplica con tu perfil y negocia tu participación de forma transparente.",
    },
    {
      number: 3,
      icon: "⚡",
      title: "Colabora y crece",
      description:
        "Trabaja en equipo, registra contribuciones y cobra tu parte proporcional cuando el proyecto genere ingresos.",
    },
  ],
} as const;

export const features = {
  title: "¿Por qué CoopWork?",
  subtitle: "Construido para equipos que valoran la transparencia desde el día uno.",
  items: [
    {
      title: "Equity en tiempo real",
      description:
        "Cada contribución queda registrada y el reparto se actualiza automáticamente para todo el equipo.",
    },
    {
      title: "Sin intermediarios",
      description:
        "Los acuerdos entre colaboradores son directos, sin comisiones ocultas ni terceros involucrados.",
    },
    {
      title: "Perfiles verificados",
      description:
        "Cada miembro valida sus habilidades. Siempre sabes con quién estás construyendo tu proyecto.",
    },
    {
      title: "Proyectos de todo tipo",
      description:
        "Desde apps hasta contenido y diseño — cualquier idea puede convertirse en un proyecto colaborativo.",
    },
    {
      title: "Pagos cuando el proyecto factura",
      description:
        "El reparto se activa cuando hay ingresos reales. Sin riesgo económico para el equipo inicial.",
    },
    {
      title: "Comunidad activa",
      description:
        "Foros, mentores y recursos para hacer crecer tu proyecto y tu red de colaboradores.",
    },
  ],
} as const;

export const equity = {
  title: "Equity transparente desde el día uno",
  subtitle: "Cada colaborador conoce exactamente su parte. Sin sorpresas, sin letra chica.",
  chartCenterLabel: "Proyecto",
  chartCenterValue: "AppX",
  legendHint: "Pasa el cursor sobre cada sección para destacarla",
  slices: [
    { name: "Carlos", role: "Backend", percentage: 40, strokeColor: "#7c3aed" },
    { name: "Ana", role: "Diseño", percentage: 35, strokeColor: "#4f46e5" },
    { name: "Marta", role: "Marketing", percentage: 25, strokeColor: "#9333ea" },
  ],
} as const;

export const showcase = {
  title: "Proyectos reales, equipos reales",
  subtitle: "Ejemplos de lo que se puede construir con CoopWork.",
  projects: [
    {
      name: "EcoTrack",
      description:
        "App de seguimiento de huella de carbono personal y por equipos.",
      stack: ["React Native", "Node.js", "PostgreSQL"],
      members: 4,
      status: "active" as const,
      statusLabel: "Activo",
      equityExample: "Dev 40% · Diseño 35% · PM 25%",
    },
    {
      name: "MentalFlow",
      description: "Plataforma de bienestar mental con IA para equipos remotos.",
      stack: ["Next.js", "Python", "OpenAI"],
      members: 3,
      status: "looking" as const,
      statusLabel: "Buscando diseñador",
      equityExample: "Backend 50% · PM 30% · Diseño 20%",
    },
    {
      name: "FinBuddy",
      description: "Gestor de finanzas personales gamificado para jóvenes.",
      stack: ["Flutter", "Firebase", "Dart"],
      members: 2,
      status: "looking" as const,
      statusLabel: "Buscando backend",
      equityExample: "Diseño 55% · PM 45%",
    },
  ],
} as const;

export const cta = {
  title: "¿Listo para construir",
  titleHighlight: "algo juntos?",
  description:
    "Únete a más de 1,200 colaboradores que ya están creando el futuro, con transparencia y equidad desde el primer día.",
  ctaPrimary: "Crear mi proyecto",
  ctaSecondary: "Explorar proyectos",
} as const;

export const footer = {
  brandName: "CoopWork",
  tagline: "Hackathon · 11 de marzo 2026",
} as const;

export const metadataContent = {
  title: "CoopWork — Construye proyectos reales",
  description:
    "Plataforma colaborativa donde los equipos reparten ganancias con justicia.",
} as const;
