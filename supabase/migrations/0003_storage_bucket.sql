-- =========================================================
-- Storage: bucket público para imagens de produtos
-- =========================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode visualizar as imagens (bucket público)
create policy "Leitura pública das imagens de produtos"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Somente administradores autenticados podem enviar/excluir imagens
create policy "Admin envia imagens de produtos"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admin atualiza imagens de produtos"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "Admin exclui imagens de produtos"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
