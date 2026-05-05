-- TOUR 360 required seed data

insert into public.destinations (
  name,
  country,
  description,
  is_national
)
select
  values_to_insert.name,
  values_to_insert.country,
  values_to_insert.description,
  values_to_insert.is_national
from (
  values
    ('Maputo', 'Mocambique', 'Capital vibrante com cultura, gastronomia e negocios.', true),
    ('Beira', 'Mocambique', 'Porta do centro do pais, com praia e arquitectura iconica.', true),
    ('Inhambane', 'Mocambique', 'Praias e turismo costeiro com experiencias inesqueciveis.', true),
    ('Gaza', 'Mocambique', 'Provincia com natureza, cultura e boas ligacoes regionais.', true),
    ('Nampula', 'Mocambique', 'Centro do norte com historia e acesso a praias e ilhas.', true),
    ('Lichinga', 'Mocambique', 'Altiplano do norte, clima fresco e paisagens unicas.', true),
    ('Beira - Maputo', 'Mocambique', 'Rota nacional: Beira ↔ Maputo.', true),
    ('Beira - Nampula', 'Mocambique', 'Rota nacional: Beira ↔ Nampula.', true),
    ('Maputo - Beira', 'Mocambique', 'Rota nacional: Maputo ↔ Beira.', true),
    ('Maputo - Vilankulo', 'Mocambique', 'Rota nacional: Maputo ↔ Vilankulo.', true),
    ('Vilankulo - Beira', 'Mocambique', 'Rota nacional: Vilankulo ↔ Beira.', true),
    ('Beira - Lichinga', 'Mocambique', 'Rota nacional: Beira ↔ Lichinga.', true),
    ('Maputo - Lichinga', 'Mocambique', 'Rota nacional: Maputo ↔ Lichinga.', true),
    ('Lichinga - Maputo', 'Mocambique', 'Rota nacional: Lichinga ↔ Maputo.', true),
    ('Nampula - Beira', 'Mocambique', 'Rota nacional: Nampula ↔ Beira.', true),
    ('Pemba', 'Mocambique', 'Destino tropical no norte, ideal para lazer premium.', true),
    ('Johannesburgo', 'Africa do Sul', 'Centro urbano e de negocios muito procurado.', false),
    ('Lisboa', 'Portugal', 'Capital europeia com turismo, cultura e conexoes internacionais.', false),
    ('Nairobi', 'Quenia', 'Hub regional com vida urbana e safaris proximos.', false),
    ('Dar es Salaam', 'Tanzania', 'Porta para Zanzibar e costa do Indico.', false),
    ('Dubai', 'Emirados Arabes Unidos', 'Destino internacional premium para negocios e lazer.', false)
) as values_to_insert(name, country, description, is_national)
where not exists (
  select 1
  from public.destinations d
  where d.name = values_to_insert.name
    and d.country = values_to_insert.country
);

insert into public.packages (
  name,
  slug,
  type,
  category,
  description,
  price_min,
  price_max,
  currency,
  transport,
  is_active
)
values
  ('Hinkwero', 'hinkwero', 'nacional', 'economico', 'Pacote nacional economico para explorar Mocambique com conforto essencial.', 15000, 60000, 'MZN', array['one-way', 'round-trip'], true),
  ('Ciriro', 'ciriro', 'nacional', 'intermediario', 'Pacote nacional intermediario com experiencias ampliadas e melhor acomodacao.', 70000, 200000, 'MZN', array['one-way', 'round-trip'], true),
  ('Kaiyssa', 'kaiyssa', 'nacional', 'premium', 'Pacote nacional premium com servico personalizado e conforto elevado.', 200000, null, 'MZN', array['one-way', 'round-trip'], true),
  ('Basico Internacional', 'basico-internacional', 'internacional', 'economico', 'Pacote internacional de entrada para viagens acessiveis.', 70000, 150000, 'MZN', array['one-way', 'round-trip'], true),
  ('Intermediario Internacional', 'intermediario-internacional', 'internacional', 'intermediario', 'Pacote internacional equilibrado para lazer e negocios.', 160000, 300000, 'MZN', array['one-way', 'round-trip'], true),
  ('Premium Internacional', 'premium-internacional', 'internacional', 'premium', 'Pacote internacional premium com atendimento exclusivo.', 300000, null, 'MZN', array['one-way', 'round-trip'], true)
on conflict (slug) do update
set
  name = excluded.name,
  type = excluded.type,
  category = excluded.category,
  description = excluded.description,
  price_min = excluded.price_min,
  price_max = excluded.price_max,
  currency = excluded.currency,
  transport = excluded.transport,
  is_active = excluded.is_active;

insert into public.vehicles (
  model,
  price_per_day,
  currency,
  is_available,
  description
)
select
  values_to_insert.model,
  values_to_insert.price_per_day,
  values_to_insert.currency,
  values_to_insert.is_available,
  values_to_insert.description
from (
  values
    ('Toyota Quantum', 13000::numeric, 'MZN', true, 'Viatura ideal para grupos e deslocacoes turisticas com conforto.'),
    ('Land Cruiser Prado', 12000::numeric, 'MZN', true, 'SUV robusto para viagens premium, executivas e rotas exigentes.')
) as values_to_insert(model, price_per_day, currency, is_available, description)
where not exists (
  select 1 from public.vehicles v where v.model = values_to_insert.model
);

-- Contas de atendimento (caixa): criadas pelo administrador em /admin/caixa (requer SUPABASE_SERVICE_ROLE_KEY).
-- Ou manualmente: update public.profiles set role = 'caixa' where id = '<uuid do auth.users>';
