# CoopWork

> *Construye proyectos reales. Reparte ganancias con justicia.*

Plataforma colaborativa donde emprendedores con habilidades complementarias (diseño, ingeniería, gestión) se unen para construir proyectos con una **distribución de equity transparente** definida desde el primer día.

Desarrollado como proyecto de hackathon — **USAC, marzo 2026**.

---

## Equipo

| Nombre | Rol |
|--------|-----|
| **Milton Beltrán** | Frontend Developer |
| **George Albadr** | Backend Developer |
| **Cesar Marroquín** | FullStack Developer |

---

## Propósito

CoopWork resuelve un problema común en proyectos colaborativos: la falta de claridad sobre el reparto de ganancias. La plataforma permite:

- **Conectar** personas con habilidades complementarias
- **Definir** el equity de cada rol antes de empezar
- **Colaborar** en proyectos reales con transparencia total
- **Repartir** ganancias de forma justa cuando el proyecto factura

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 16 |
| Lenguaje | TypeScript |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Estilos | TailwindCSS 4 |
| UI Components | Radix UI · shadcn/ui |
| Animaciones | Framer Motion |
| Iconos | Lucide React |

---

## Funcionalidades

- **Landing page** — Hero, estadísticas, cómo funciona y showcase de proyectos
- **Autenticación** — Email/contraseña con Supabase
- **Feed de proyectos** — Explorar proyectos abiertos
- **Crear proyectos** — Definir roles y porcentajes de equity (suma 100%)
- **Unirse a roles** — Colaborar en proyectos existentes
- **Perfiles de usuario** — Carrera, bio y avatar
- **Protección de rutas** — Middleware para `/projects/new` y `/profile`

---

## Inicio rápido

### Requisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/exp-week.git
cd exp-week/coopwork

# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección siguiente)
```

### Variables de entorno

Crea un archivo `.env.local` en `coopwork/` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### Comandos

```bash
cd coopwork

npm run dev    # Servidor de desarrollo en localhost:3000
npm run build  # Build de producción
npm run lint   # ESLint
```

---

## Estructura del proyecto

```
exp-week/
├── coopwork/                 # Aplicación Next.js
│   ├── app/
│   │   ├── page.tsx         # Landing
│   │   ├── login/           # Autenticación
│   │   ├── projects/        # Feed, crear, detalle
│   │   ├── profile/         # Perfil de usuario
│   │   └── api/             # API routes
│   ├── components/
│   ├── lib/
│   └── middleware.ts
├── PROYECTO.md              # Documentación del proyecto
└── README.md
```

---

## Base de datos (Supabase)

| Tabla | Descripción |
|-------|-------------|
| `careers` | Referencia de carreras para registro |
| `profiles` | Perfil de usuario (extiende auth.users) |
| `projects` | Proyectos con estado (`open` \| `full` \| `closed`) |
| `project_roles` | Roles por proyecto con equity % y disponibilidad |

---

## Despliegue

<!-- Pegar enlace cuando esté disponible -->

**URL:** _[Pegar enlace aquí]_

---

## Licencia

Proyecto de hackathon — USAC 2026.
