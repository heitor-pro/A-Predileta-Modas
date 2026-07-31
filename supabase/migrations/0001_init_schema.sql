-- =========================================================
-- A Predileta Modas — Schema inicial
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
-- Espelha auth.users para guardar informações extras do admin (nome, papel).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  promo_price numeric(10,2) check (promo_price is null or promo_price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_promo boolean not null default false,
  is_featured boolean not null default false,
  is_new boolean not null default true,
  is_active boolean not null default true,
  shipping_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_promo on public.products(is_promo) where is_promo = true;
create index if not exists idx_products_featured on public.products(is_featured) where is_featured = true;

-- Atualiza "updated_at" automaticamente a cada alteração
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- product_images ----------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  storage_path text not null,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on public.product_images(product_id);

-- ---------- orders (histórico opcional dos pedidos enviados ao WhatsApp) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  city text not null,
  cep text not null,
  address text,
  delivery_method text not null default 'entrega',
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- settings (chave/valor simples, uso opcional) ----------
create table if not exists public.settings (
  key text primary key,
  value text not null
);
