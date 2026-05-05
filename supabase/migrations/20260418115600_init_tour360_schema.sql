-- TOUR 360 initial schema
create extension if not exists "pgcrypto";

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('nacional', 'internacional')),
  category text not null check (category in ('economico', 'intermediario', 'premium')),
  description text,
  price_min numeric not null,
  price_max numeric,
  currency text not null default 'MZN',
  accommodation text,
  transport text[],
  meals text,
  included_services text[],
  target_audience text,
  is_active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  description text,
  image_url text,
  is_national boolean not null default true
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  document_type text,
  document_number text,
  address text,
  client_type text not null default 'individual' check (client_type in ('individual', 'corporativo')),
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  package_id uuid references public.packages (id) on delete set null,
  destination_id uuid references public.destinations (id) on delete set null,
  travel_type text not null check (travel_type in ('one-way', 'round-trip')),
  departure_date date not null,
  return_date date,
  num_travelers integer not null default 1 check (num_travelers > 0),
  total_price numeric not null,
  status text not null default 'pendente' check (status in ('pendente', 'confirmada', 'cancelada', 'concluida')),
  payment_status text not null default 'aguardando' check (payment_status in ('aguardando', 'pago', 'reembolsado')),
  notes text,
  created_at timestamptz not null default now(),
  constraint return_date_after_departure check (
    return_date is null or return_date >= departure_date
  )
);

create table if not exists public.corporate_clients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  company_name text not null,
  nuit text,
  contact_person text,
  payment_modality text check (payment_modality in ('antecipado', 'postecipado')),
  credit_limit numeric not null default 0,
  is_validated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  plate text unique,
  capacity integer,
  price_per_day numeric not null,
  currency text not null default 'MZN',
  is_available boolean not null default true,
  image_url text,
  description text
);

create table if not exists public.vehicle_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  start_date date not null,
  end_date date not null,
  total_days integer not null check (total_days > 0),
  total_price numeric not null,
  destination text,
  status text not null default 'pendente' check (status in ('pendente', 'confirmada', 'cancelada')),
  created_at timestamptz not null default now(),
  constraint end_date_after_start check (end_date >= start_date)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings (id) on delete set null,
  vehicle_booking_id uuid references public.vehicle_bookings (id) on delete set null,
  amount numeric not null,
  method text not null check (method in ('mpesa', 'transferencia', 'dinheiro', 'cartao')),
  status text not null default 'aguardando' check (status in ('aguardando', 'confirmado', 'falhado')),
  reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  constraint payment_source_check check (
    booking_id is not null or vehicle_booking_id is not null
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
