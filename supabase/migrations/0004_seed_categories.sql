-- =========================================================
-- Categorias iniciais sugeridas
-- =========================================================

insert into public.categories (name, slug, sort_order) values
  ('Vestidos', 'vestidos', 1),
  ('Blusas', 'blusas', 2),
  ('Calças', 'calcas', 3),
  ('Conjuntos', 'conjuntos', 4),
  ('Moda Fitness', 'moda-fitness', 5),
  ('Moda Íntima', 'moda-intima', 6),
  ('Infantil', 'infantil', 7),
  ('Acessórios', 'acessorios', 8),
  ('Outros', 'outros', 9)
on conflict (slug) do nothing;
