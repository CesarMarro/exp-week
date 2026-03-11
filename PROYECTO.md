# CoopWork — Documentación del Proyecto

## Equipo

| Nombre | Rol |
|--------|-----|
| **Milton Beltrán** | Frontend Developer |
| **George Albadr** | Backend Developer |
| **Cesar Marroquín** | FullStack Developer |

---

## Resumen del Proyecto

**CoopWork** es una plataforma colaborativa donde emprendedores con habilidades complementarias (diseño, ingeniería, gestión) se unen para construir proyectos con una **distribución de equity transparente** definida desde el primer día.

Desarrollado como proyecto de hackathon (USAC, marzo 2026).

---

## Propósito

CoopWork nace para resolver un problema común en proyectos colaborativos: la falta de claridad sobre el reparto de ganancias. La plataforma permite:

- **Conectar** personas con habilidades complementarias
- **Definir** el equity de cada rol antes de empezar
- **Colaborar** en proyectos reales con transparencia total
- **Repartir** ganancias de forma justa cuando el proyecto factura

> *"Construye proyectos reales. Reparte ganancias con justicia."*

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 |
| **Lenguaje** | TypeScript |
| **Base de datos** | Supabase (PostgreSQL) |
| **Autenticación** | Supabase Auth |
| **Estilos** | TailwindCSS 4 |
| **UI Components** | Radix UI · shadcn/ui |
| **Animaciones** | Framer Motion |
| **Iconos** | Lucide React |

---

## Funcionalidades Principales

- **Landing page** con hero, estadísticas, cómo funciona y showcase de proyectos
- **Autenticación** por email/contraseña con Supabase
- **Feed de proyectos** abiertos para explorar
- **Crear proyectos** con definición de roles y porcentajes de equity (suma 100%)
- **Unirse a roles** en proyectos existentes
- **Perfiles de usuario** con carrera, bio y avatar
- **Protección de rutas** (middleware) para `/projects/new` y `/profile`

---

## Arquitectura

### Base de datos (Supabase)

- **careers** — Referencia para carreras (login/registro)
- **profiles** — Extiende `auth.users`; perfil del usuario
- **projects** — Proyectos con estado (`open` | `full` | `closed`)
- **project_roles** — Roles por proyecto con equity % y estado (disponible/ocupado)

### Lógica de negocio

- **createProject()** — Inserta proyecto + roles; equity debe sumar 100%
- **joinRole()** — Asigna usuario a rol; si todos los roles se llenan → `status: 'full'`
- **getProjectWithRoles()** — Consulta proyectos con roles y perfiles

---

## Enlace de la aplicación desplegada

<!-- Pegar aquí el enlace cuando esté disponible -->

**URL:** _[Pegar enlace aquí]_

---

## Comandos de desarrollo

```bash
cd coopwork

npm run dev    # Servidor de desarrollo en localhost:3000
npm run build  # Build de producción
npm run lint   # ESLint
```

---

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

*Documento generado · Hackathon USAC · 11 de marzo 2026*
