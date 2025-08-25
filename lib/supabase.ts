import { createClient } from '@supabase/supabase-js';

// Este archivo crea un cliente de Supabase que podemos usar en toda la aplicación.
// Se asegura de que las variables de entorno existan antes de intentar conectar.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Anon Key is not defined in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
