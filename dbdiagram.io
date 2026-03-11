Project CoopWork {
  database_type: "PostgreSQL"
  Note: "MVP schema para Supabase (auth.users es gestionada por Supabase Auth)"
}

Enum project_status {
  open
  full
  closed
}

Table auth_users {
  id uuid [pk, note: "Representa auth.users.id de Supabase"]
  created_at timestamptz
}

Table profiles {
  id uuid [pk, ref: > auth_users.id, note: "1:1 con auth.users"]
  full_name varchar(120)
  career varchar(120)
  bio text
  avatar_url text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table projects {
  id uuid [pk, default: `gen_random_uuid()`]
  owner_id uuid [not null, ref: > profiles.id]
  title varchar(160) [not null]
  description text [not null]
  status project_status [not null, default: 'open']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    owner_id
    status
    created_at
  }
}

Table project_roles {
  id uuid [pk, default: `gen_random_uuid()`]
  project_id uuid [not null, ref: > projects.id]
  role_name varchar(100) [not null]
  equity_percent numeric(5,2) [not null, note: "0 < equity_percent <= 100"]
  filled_by uuid [ref: > profiles.id, note: "null = vacante"]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    project_id
    filled_by
    (project_id, role_name) [unique]
  }

  Note: "La suma de equity por project_id debe ser 100 (validar con trigger/función)"
}