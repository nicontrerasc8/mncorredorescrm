# Modelo de base de datos - MN Corredores CRM

Propuesta relacional para PostgreSQL/Supabase. Los UUID pueden reemplazarse por `bigserial` si se prefiere.

```sql
create type user_role as enum ('admin', 'jefe', 'ejecutivo');
create type account_type as enum ('cliente_actual', 'prospecto');
create type lead_state as enum ('nuevo', 'contactado', 'en_evaluacion', 'propuesta_enviada', 'negociacion', 'ganado', 'perdido');
create type source_type as enum ('conocido', 'nuevo');
create type activity_type as enum ('llamada', 'reunion', 'correo', 'seguimiento');
create type activity_status as enum ('pendiente', 'en_proceso', 'completada', 'vencida', 'reprogramada');
create type priority as enum ('alta', 'media', 'baja');

create table users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text,
  role user_role not null,
  status text not null default 'activo',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null, -- clientes_actuales, prospectos, comercial_general
  manager_id uuid references users(id),
  created_at timestamptz not null default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  unique (team_id, user_id)
);

create table accounts (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  type account_type not null,
  segment text,
  assigned_executive_id uuid references users(id),
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  full_name text not null,
  role_title text,
  phone text,
  email text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id),
  primary_contact_id uuid references contacts(id),
  company_name text not null,
  contact_name text not null,
  contact_role text,
  contact_phone text,
  contact_email text,
  state lead_state not null default 'nuevo',
  source text,
  source_type source_type not null default 'nuevo',
  estimated_value numeric(12,2) not null default 0,
  assigned_executive_id uuid references users(id),
  assigned_by uuid references users(id),
  last_follow_up_at timestamptz,
  lost_reason text,
  won_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table lead_state_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  from_state lead_state,
  to_state lead_state not null,
  comment text,
  changed_by uuid references users(id),
  changed_at timestamptz not null default now()
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  account_id uuid references accounts(id) on delete cascade,
  contact_id uuid references contacts(id),
  type activity_type not null,
  title text not null,
  description text,
  deadline_at timestamptz not null,
  priority priority not null default 'media',
  responsible_id uuid references users(id),
  status activity_status not null default 'pendiente',
  completed_at timestamptz,
  rescheduled_from timestamptz,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  activity_id uuid references activities(id) on delete cascade,
  author_id uuid references users(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  period_month date not null,
  executive_id uuid references users(id),
  team_id uuid references teams(id),
  assigned_leads integer not null default 0,
  managed_leads integer not null default 0,
  won_leads integer not null default 0,
  lost_leads integer not null default 0,
  pipeline_value numeric(12,2) not null default 0,
  conversion_rate numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

create index idx_leads_state on leads(state);
create index idx_leads_executive on leads(assigned_executive_id);
create index idx_leads_last_follow_up on leads(last_follow_up_at);
create index idx_activities_deadline on activities(deadline_at);
create index idx_activities_responsible on activities(responsible_id);
create index idx_kpi_snapshots_period on kpi_snapshots(period_month);
```

## Relacion principal

- `users`: administradores, jefes y ejecutivos.
- `teams`: areas comerciales. Ejemplo: `Clientes actuales` y `Prospectos`, cada una con un jefe.
- `accounts`: empresas, clasificadas como cliente actual o prospecto.
- `contacts`: contactos asociados a empresas.
- `leads`: oportunidad comercial. Incluye datos de contacto directos para captura rapida y puede enlazarse a `accounts`/`contacts`.
- `lead_state_history`: historial completo de cambios de estado y comentarios.
- `activities`: tareas con deadline, responsable, prioridad y cumplimiento.
- `comments`: comentarios libres sobre leads o actividades.
- `kpi_snapshots`: historico mensual para dashboards y timelines.
