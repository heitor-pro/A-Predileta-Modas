-- =========================================================
-- Políticas de Row Level Security (RLS)
-- Regra geral: qualquer visitante pode LER produtos ativos e categorias.
-- Somente um usuário autenticado com perfil em "profiles" (admin) pode
-- criar, editar ou excluir dados.
-- =========================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Função auxiliar: verifica se o usuário atual é um admin cadastrado
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid()
  );
$$ language sql stable security definer;

-- ---------- profiles ----------
create policy "Admin vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------- categories ----------
create policy "Qualquer pessoa lê categorias"
  on public.categories for select
  using (true);

create policy "Admin gerencia categorias"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- products ----------
create policy "Qualquer pessoa lê produtos ativos"
  on public.products for select
  using (is_active = true or public.is_admin());

create policy "Admin gerencia produtos"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- product_images ----------
create policy "Qualquer pessoa lê imagens de produtos"
  on public.product_images for select
  using (true);

create policy "Admin gerencia imagens de produtos"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- orders ----------
-- Não há checkout online: o histórico de pedidos (se usado) só é
-- visível e gerenciável pelo admin.
create policy "Admin lê pedidos"
  on public.orders for select
  using (public.is_admin());

create policy "Qualquer pessoa pode registrar um pedido"
  on public.orders for insert
  with check (true);

-- ---------- settings ----------
create policy "Qualquer pessoa lê configurações públicas"
  on public.settings for select
  using (true);

create policy "Admin gerencia configurações"
  on public.settings for all
  using (public.is_admin())
  with check (public.is_admin());
