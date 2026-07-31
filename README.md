# A Predileta Modas — Loja Online

Aplicação completa de catálogo de moda feminina com painel administrativo, autenticação segura,
upload de imagens com recorte, carrinho e finalização de pedido via WhatsApp.

**Stack:** React + Vite + TypeScript + Tailwind CSS + React Router + Framer Motion +
React Hook Form + Zod + Supabase (banco de dados, autenticação e storage).

---

## 1. Instalação

Pré-requisitos: Node.js 18 ou superior.

```bash
npm install
cp .env.example .env
```

Depois preencha o arquivo `.env` com os dados do seu projeto Supabase (passo 2) e o número de
WhatsApp da loja (passo 6).

Para rodar localmente:

```bash
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos finais ficam em `dist/`, prontos para deploy em qualquer hospedagem estática
(Vercel, Netlify, Cloudflare Pages etc.).

---

## 2. Configurando o Supabase

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e clique em **New Project**.
2. Escolha um nome (ex.: `a-predileta-modas`), uma senha para o banco e a região mais próxima
   (ex.: São Paulo).
3. Após o projeto ser criado, vá em **Project Settings > API** e copie:
   - `Project URL` → cole em `VITE_SUPABASE_URL` no arquivo `.env`
   - `anon public key` → cole em `VITE_SUPABASE_ANON_KEY` no arquivo `.env`

**Nunca use a `service_role key` no frontend.** A chave `anon` é segura para uso público porque
todo o acesso aos dados é controlado pelas políticas de RLS criadas nas migrations.

---

## 3. Executando as migrations (criação das tabelas e regras de segurança)

No painel do Supabase, vá em **SQL Editor** e execute, **nesta ordem**, o conteúdo de cada
arquivo da pasta `supabase/migrations/`:

1. `0001_init_schema.sql` — cria as tabelas (`profiles`, `categories`, `products`,
   `product_images`, `orders`, `settings`), índices e relacionamentos.
2. `0002_row_level_security.sql` — ativa o RLS e cria as políticas de segurança (produtos e
   categorias são públicos para leitura; escrita é exclusiva do admin).
3. `0003_storage_bucket.sql` — cria o bucket `product-images` e suas políticas de acesso.
4. `0004_seed_categories.sql` — cadastra as categorias iniciais sugeridas.
5. `0005_create_admin_profile.sql` — **execute somente depois do passo 4 abaixo**, pois depende
   do usuário administrador já existir.

Basta colar o conteúdo de cada arquivo no SQL Editor e clicar em **Run**.

---

## 4. Criando o usuário administrador (login da sua mãe)

Por segurança, o Supabase não permite criar um usuário com senha diretamente via SQL. Siga estes
passos no painel:

1. Vá em **Authentication > Users** e clique em **Add user > Create new user**.
2. E-mail: `macijane22@gmail.com`
3. Senha: `Marcia22`
4. Marque a opção **Auto Confirm User** (para não precisar confirmar por e-mail).
5. Clique em **Create user**.
6. Volte ao **SQL Editor** e execute o arquivo `0005_create_admin_profile.sql` — isso vincula
   esse usuário à tabela `profiles`, liberando o acesso ao painel `/admin`.

A partir daí, o login em `/admin/login` funciona com esse e-mail e senha. **Assim que possível,
oriente sua mãe a trocar a senha pelo próprio painel**, em **Configurações > Alterar senha** —
a senha nunca fica exposta no código-fonte, pois toda a autenticação é feita pelo Supabase Auth.

Se ela esquecer a senha, a tela de login tem a opção **"Esqueci minha senha"**, que envia um
e-mail de recuperação (é necessário configurar o envio de e-mails do Supabase — por padrão já
funciona em modo de testes com limite de envios).

---

## 5. Criando o Storage (upload de fotos)

Isso já é feito automaticamente pela migration `0003_storage_bucket.sql`, que cria o bucket
`product-images` como público (para os clientes visualizarem as fotos) e protegido por RLS para
upload (somente o admin pode enviar/excluir imagens).

Se quiser conferir manualmente: **Storage** no menu lateral do Supabase deve mostrar o bucket
`product-images`.

---

## 6. Configurando o número de WhatsApp

Edite o arquivo `.env`:

```
VITE_WHATSAPP_NUMBER=5579999999999
```

Use o formato internacional, somente números: código do país (55 para Brasil) + DDD + número,
sem espaços, traços ou parênteses. Depois de alterar, é necessário rodar `npm run build` e
publicar novamente (deploy) para a mudança entrar em vigor no site publicado.

---

## 7. Ajustando o frete

O cálculo de frete é simplificado (baseado em faixas de CEP), definido em
`src/utils/shipping-rules.ts`. Abra o arquivo e ajuste os valores e faixas conforme sua região:

```ts
export const SHIPPING_RULES = [
  { label: 'Capital / Região Metropolitana', from: 49000, to: 49099, price: 12 },
  { label: 'Interior do estado', from: 49100, to: 49999, price: 22 },
  { label: 'Outros estados', from: 0, to: 99999, price: 35 },
];
```

Não há pagamento online: o frete calculado apenas entra no total exibido e na mensagem enviada
ao WhatsApp.

---

## 8. Como adicionar, editar e organizar produtos

1. Acesse `/admin/login` e entre com o e-mail e senha do administrador.
2. No menu **Produtos**, clique em **+ Novo produto**.
3. Envie as fotos: ao escolher uma imagem, um editor de recorte abre automaticamente — é
   possível mover, dar zoom e centralizar antes de salvar. Isso garante que todas as fotos do
   catálogo fiquem no mesmo formato, mesmo vindas de celulares diferentes.
4. Preencha nome, descrição, preço, categoria, tamanhos, cores e estoque.
5. Marque as opções desejadas: **Em promoção**, **Destaque**, **Novo**, **Ativo** (visível na
   loja) e **Frete disponível**.
6. Clique em **Cadastrar produto**.

Na listagem de produtos é possível pesquisar, editar, duplicar e excluir qualquer item.

---

## 9. Como alterar categorias

No menu **Categorias** do painel administrativo é possível criar, renomear e excluir categorias
livremente. Ao excluir uma categoria que já tem produtos vinculados, esses produtos ficam sem
categoria (não são excluídos).

---

## 10. Como alterar o tema (cores)

A identidade visual (preto, prata e cinza, nos modos claro e escuro) é definida em
`tailwind.config.js`, na seção `theme.extend.colors`. Para ajustar tons, edite os valores
hexadecimais de `ink` (preto) e `silver` (prata/cinza).

---

## 11. Deploy

Qualquer serviço de hospedagem estática funciona. Exemplo com **Vercel**:

```bash
npm install -g vercel
vercel
```

Configure as mesmas variáveis do `.env` no painel do serviço escolhido (Environment Variables):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`, `VITE_STORE_NAME`.

No Supabase, em **Authentication > URL Configuration**, adicione a URL final do site publicado
em **Site URL** e **Redirect URLs** (necessário para o link de recuperação de senha funcionar).

---

## 12. Estrutura do projeto

```
src/
  components/   Componentes reutilizáveis (ui, layout, product, cart, admin, auth)
  pages/        Páginas da loja e do painel administrativo
  hooks/        Hooks customizados (produtos, categorias, debounce, scroll reveal)
  contexts/     Contextos globais (tema, autenticação, carrinho, favoritos)
  services/     Comunicação com Supabase e regras de negócio (produtos, categorias,
                storage, WhatsApp, frete)
  lib/          Cliente do Supabase e utilitários gerais
  types/        Tipos TypeScript do domínio e do banco de dados
  utils/        Regras auxiliares (ex.: faixas de frete)
  routes/       Definição das rotas da aplicação
supabase/
  migrations/   Scripts SQL versionados (schema, RLS, storage, seed)
```

---

## 13. Segurança

- A chave pública do Supabase (`anon key`) é a única exposta no frontend — por design, ela não
  concede nenhum acesso de escrita sem uma política de RLS que permita.
- Todas as tabelas têm **Row Level Security** habilitado: qualquer visitante só consegue ler
  produtos ativos e categorias; criar, editar ou excluir dados exige estar autenticado como
  administrador.
- A senha do administrador nunca é armazenada em texto puro nem aparece no código — ela é
  gerenciada inteiramente pelo Supabase Auth (hash seguro, recuperação por e-mail, sessão
  persistente).
- Rotas `/admin/*` são protegidas no frontend (redirecionamento automático para o login) **e**
  no backend (RLS), então mesmo que alguém tente acessar a API diretamente, sem estar autenticado
  como admin nenhuma escrita é permitida.

---

## 14. Qualidade e acessibilidade

- Tipagem completa em TypeScript.
- Componentização por responsabilidade (ui / layout / domínio).
- Foco visível em todos os elementos interativos (`:focus-visible`), rótulos (`label`) associados
  a campos de formulário, e `aria-label` em botões apenas com ícone.
- Respeita `prefers-reduced-motion` para pessoas sensíveis a animações.
- Layout responsivo testado para celular, tablet, notebook e desktop.
