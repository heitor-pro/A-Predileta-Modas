import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;


if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase não configurado. Copie ".env.example" para ".env" e preencha as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  );
}

// Cliente único do Supabase, usado em toda a aplicação.
// A chave "anon" é pública por design — a segurança real vem das políticas RLS
// configuradas no banco (ver supabase/migrations). Nunca coloque a service_role key no frontend.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
