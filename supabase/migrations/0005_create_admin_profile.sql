-- =========================================================
-- Vincula o usuário administrador (criado no painel do Supabase Auth)
-- à tabela "profiles", liberando o acesso ao painel /admin.
--
-- IMPORTANTE: execute este script SOMENTE DEPOIS de criar o usuário
-- em Authentication > Users no painel do Supabase, com o e-mail:
--   macijane22@gmail.com
-- (veja o passo a passo completo no README.md)
-- =========================================================

insert into public.profiles (id, email, full_name, role)
select id, email, 'Márcia', 'admin'
from auth.users
where email = 'macijane22@gmail.com'
on conflict (id) do nothing;
