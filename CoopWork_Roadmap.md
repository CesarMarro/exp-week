# CoopWork — Hackathon Plan
**Hackathon · Miércoles 11 de marzo · Pilar: Justicia**
Stack: Next.js · Supabase · TailwindCSS

---

## ¿Qué es CoopWork?

Plataforma donde emprendedores de distintas carreras (diseño, programación, administración, etc.) se unen para ejecutar proyectos reales, con reparto de ganancias transparente y roles claros desde el inicio.

---

## MVP — Alcance en 1 hora

Lo que SÍ entra al MVP:
- Registro/login con Supabase Auth (Google o email/password)
- Crear un proyecto con título, descripción, roles necesarios y % de reparto
- Listar proyectos abiertos
- Unirse a un proyecto ocupando un rol disponible
- Ver los miembros y su % asignado dentro de un proyecto

Lo que NO entra (post-hackathon):
- Chat entre miembros
- Sistema de pagos real
- Votaciones o disputas
- Notificaciones

---

## Modelo de datos (Supabase)

```sql
-- Usuarios (extendido del auth de Supabase)
profiles (
  id uuid references auth.users,
  full_name text,
  career text,         -- "Diseño", "Ingeniería", "Administración", etc.
  bio text,
  avatar_url text
)

-- Proyectos
projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  owner_id uuid references profiles(id),
  status text default 'open',  -- 'open' | 'full' | 'closed'
  created_at timestamptz default now()
)

-- Roles dentro de un proyecto
project_roles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  role_name text not null,      -- "Desarrollador", "Diseñador", "PM"
  equity_percent numeric not null,  -- porcentaje asignado a este rol
  filled_by uuid references profiles(id) default null  -- null = disponible
)
```

---

## Arquitectura Next.js

```
/app
  /page.tsx              → Landing / listado de proyectos
  /login/page.tsx        → Auth con Supabase
  /projects
    /page.tsx            → Feed de proyectos abiertos
    /new/page.tsx        → Crear proyecto + roles
    /[id]/page.tsx       → Detalle del proyecto, unirse a rol
  /profile/page.tsx      → Perfil del usuario

/lib
  /supabase.ts           → Cliente Supabase (createBrowserClient)
  /supabase-server.ts    → Cliente server-side (createServerClient)

/components
  ProjectCard.tsx
  RoleSlot.tsx
  EquityBadge.tsx
  Navbar.tsx
```

---

## Roadmap — 60 minutos

| Tiempo | Hito |
|--------|------|
| 0:00 – 0:10 | Setup: repo, Supabase project, variables de entorno, SQL schema |
| 0:10 – 0:25 | Backend: tablas, RLS policies, API routes |
| 0:25 – 0:45 | Frontend: páginas y componentes principales |
| 0:45 – 0:55 | Integración: conectar UI con Supabase real |
| 0:55 – 1:00 | Demo: flujo completo funcional, deploy en Vercel |

---

## División de tareas

---

### 🔵 Frontend Engineer

**Responsabilidad:** Todo lo visual, navegación y UX.

**Minuto 0–10 (Setup)**
- Inicializar repo con `npx create-next-app@latest coopwork --typescript --tailwind --app`
- Instalar dependencias: `@supabase/ssr @supabase/supabase-js`
- Crear `/lib/supabase.ts` con `createBrowserClient`
- Configurar `.env.local` con las keys que provee el Back

**Minuto 10–25 (Componentes base)**
- `Navbar.tsx` — logo, link a proyectos, botón login/logout
- `ProjectCard.tsx` — muestra título, descripción, roles disponibles
- `RoleSlot.tsx` — muestra nombre del rol, % equity, estado (libre/ocupado)
- `EquityBadge.tsx` — pill de color con el porcentaje

**Minuto 25–45 (Páginas)**
- `/app/page.tsx` — Hero con CTA "Ver proyectos" y "Crear proyecto"
- `/app/projects/page.tsx` — Grid de ProjectCards (datos hardcodeados primero)
- `/app/projects/[id]/page.tsx` — Detalle: descripción + lista de RoleSlots + botón "Unirme"
- `/app/projects/new/page.tsx` — Form: título, descripción, agregar roles dinámicamente con % cada uno (validar que sumen 100%)

**Minuto 45–55 (Integración con Fullstack)**
- Reemplazar datos mock por llamadas reales a Supabase
- Manejar estado de loading y error en cada página

---

### 🟢 Backend Engineer

**Responsabilidad:** Supabase, base de datos, seguridad y API.

**Minuto 0–10 (Setup)**
- Crear proyecto en [supabase.com](https://supabase.com)
- Ejecutar el SQL del modelo de datos en el SQL Editor
- Compartir `SUPABASE_URL` y `SUPABASE_ANON_KEY` al equipo vía chat

**Minuto 10–25 (Seguridad y Auth)**
- Habilitar Auth con Email/Password en Supabase Dashboard
- Crear trigger para auto-crear `profiles` al registrarse un usuario:
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
- Configurar **Row Level Security (RLS)**:
```sql
-- Profiles: cualquiera puede leer, solo el dueño edita
alter table profiles enable row level security;
create policy "Public profiles" on profiles for select using (true);
create policy "Own profile" on profiles for update using (auth.uid() = id);

-- Projects: cualquiera lee, solo auth crea
alter table projects enable row level security;
create policy "Public projects" on projects for select using (true);
create policy "Auth creates" on projects for insert with check (auth.uid() = owner_id);

-- Roles: cualquiera lee, solo auth actualiza (para unirse)
alter table project_roles enable row level security;
create policy "Public roles" on project_roles for select using (true);
create policy "Auth fills role" on project_roles for update using (auth.uid() is not null);
create policy "Owner inserts roles" on project_roles for insert with check (auth.uid() is not null);
```

**Minuto 25–45 (API Routes en Next.js)**

Crear `/app/api/projects/route.ts`:
```ts
// GET /api/projects — listar proyectos abiertos con sus roles
// POST /api/projects — crear proyecto + roles en una transacción
```

Crear `/app/api/projects/[id]/join/route.ts`:
```ts
// POST — asignar filled_by = usuario actual en un project_role
// Validar que el rol esté libre y el usuario no tenga ya otro rol en el mismo proyecto
```

**Minuto 45–55 (QA y datos de prueba)**
- Insertar 3 proyectos de ejemplo con roles y porcentajes
- Probar todos los endpoints con Postman o Thunder Client
- Verificar que RLS bloquea acciones no autorizadas

---

### 🟡 Fullstack Engineer

**Responsabilidad:** Integración, Auth flow, deploy y pegamento entre Front y Back.

**Minuto 0–10 (Setup)**
- Coordinar que el repo esté creado (clonar del Frontend)
- Configurar `/lib/supabase-server.ts` con `createServerClient` para Server Components
- Crear middleware de Next.js para proteger rutas autenticadas:
```ts
// middleware.ts
import { createMiddlewareClient } from '@supabase/ssr'
export async function middleware(req) { ... }
export const config = { matcher: ['/projects/new', '/profile'] }
```

**Minuto 10–25 (Auth UI)**
- `/app/login/page.tsx` — Form de email/password con `supabase.auth.signInWithPassword`
- `/app/login/page.tsx` — Botón de registro con `supabase.auth.signUp`
- Manejo de sesión: `supabase.auth.getSession()` en layout principal
- Logout en Navbar conectado a `supabase.auth.signOut()`

**Minuto 25–45 (Lógica de negocio crítica)**
- `createProject()` — función que inserta en `projects` y luego inserta todos los `project_roles` en batch. Validar que los % sumen exactamente 100.
- `joinRole()` — función que hace UPDATE en `project_roles` seteando `filled_by`. Si todos los roles están llenos, actualizar `projects.status = 'full'`.
- `getProjectWithRoles()` — query con join para traer proyecto + roles + perfil de cada miembro.

**Minuto 45–55 (Deploy)**
- Push a GitHub
- Conectar repo en [vercel.com](https://vercel.com) → Import Project
- Agregar variables de entorno en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verificar deploy exitoso y compartir URL al equipo para la demo

---

## Flujo de demo (para presentar)

1. Abrir la app en Vercel
2. Registrarse como Usuario A ("Desarrollador")
3. Crear proyecto "EcoMarket GT" con 3 roles: Dev 40%, Diseño 35%, PM 25%
4. Registrarse como Usuario B ("Diseñador") y unirse al rol de Diseño
5. Mostrar que el proyecto ahora aparece con 1 rol ocupado y 2 disponibles
6. Destacar la transparencia: todos ven el % desde el inicio

---

## Comandos rápidos de referencia

```bash
# Iniciar proyecto
npx create-next-app@latest coopwork --typescript --tailwind --app

# Instalar Supabase
npm install @supabase/ssr @supabase/supabase-js

# Dev server
npm run dev

# Deploy
vercel --prod
```

---

## Checklist final antes de la demo

- [ ] Login y registro funcionan
- [ ] Se puede crear un proyecto con roles y porcentajes
- [ ] El feed muestra los proyectos abiertos
- [ ] Se puede unir a un rol desde el detalle del proyecto
- [ ] Los roles ocupados se muestran con el nombre del miembro
- [ ] App deployada en Vercel con URL pública

---

*CoopWork · Hackathon USAC · 11 de marzo 2026*
