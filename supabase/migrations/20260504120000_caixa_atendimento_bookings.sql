-- Perfis: adiciona role "caixa" (atendimento) para funcionarios de caixa.
-- Reservas: metadados para reservas registadas pelo caixa (cliente presencial / telefone)
-- e tipo unificado (pacote, viagem, aluguer). Reservas web existentes mantem reservation_type = pacote.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('client', 'admin', 'caixa'));

comment on column public.profiles.role is 'client: utilizador final; caixa: atendimento; admin: gestao total.';

-- Colunas novas em bookings (criacao mista: cliente autenticado vs funcionario)
alter table public.bookings
  add column if not exists reservation_type text not null default 'pacote'
    check (reservation_type in ('pacote', 'viagem', 'aluguer'));

alter table public.bookings
  add column if not exists created_by_user_id uuid references public.profiles (id) on delete set null;

alter table public.bookings
  add column if not exists client_name text,
  add column if not exists client_contact text,
  add column if not exists client_email text;

-- Destino em texto livre quando nao ha destination_id (ex.: viagem registada manualmente)
alter table public.bookings
  add column if not exists destination_free text;

-- Descricao do tipo de viatura para aluguer registado pelo caixa
alter table public.bookings
  add column if not exists vehicle_type text;

comment on column public.bookings.reservation_type is 'pacote: fluxo catalogo; viagem: servico generico; aluguer: aluguer de viatura.';
comment on column public.bookings.created_by_user_id is 'ID do funcionario (perfil) que criou a reserva; null = criada pelo proprio cliente no site.';
comment on column public.bookings.client_name is 'Nome do cliente final (obrigatorio em reservas criadas pelo caixa).';
comment on column public.bookings.client_contact is 'Contacto do cliente (telefone, etc.).';
comment on column public.bookings.client_email is 'Email de contacto do cliente.';
comment on column public.bookings.destination_free is 'Destino textual quando nao se usa destination_id.';
comment on column public.bookings.vehicle_type is 'Tipo/modelo de viatura para reservation_type = aluguer.';

create index if not exists idx_bookings_created_by_user_id on public.bookings (created_by_user_id);
create index if not exists idx_bookings_reservation_type on public.bookings (reservation_type);
create index if not exists idx_bookings_created_at on public.bookings (created_at);
