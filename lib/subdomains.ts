import { supabase } from '@/lib/supabase'; // Importamos nuestro conector de Supabase

// La función para validar el emoji no cambia, la mantenemos igual.
export function isValidIcon(str: string) {
  if (str.length > 10) {
    return false;
  }
  try {
    const emojiPattern = /[\p{Emoji}]/u;
    if (emojiPattern.test(str)) {
      return true;
    }
  } catch (error) {
    console.warn('Emoji regex validation failed', error);
  }
  return str.length >= 1 && str.length <= 10;
}

// --- LÓGICA DE SUPABASE ---

// Definimos un tipo para los datos que esperamos de la tabla 'Store'
type Store = {
  slug: string;
  name: string | null;
  heroTitle: string | null;
  created_at: string;
};

// Esta función busca los datos de UNA SOLA tienda por su slug.
// Se usará en la página del subdominio.
export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  const { data, error } = await supabase
    .from('Store')
    .select('slug, name, heroTitle, created_at') // Pedimos los campos que necesitamos
    .eq('slug', sanitizedSubdomain)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subdomain data:', error);
    return null;
  }

  // Devolvemos los datos en el formato que el resto de la aplicación espera.
  return data ? {
    subdomain: data.slug,
    emoji: data.heroTitle || '❓', // Usamos heroTitle como el emoji
    createdAt: new Date(data.created_at).getTime()
  } : null;
}

// Esta función busca TODAS las tiendas.
// Se usará en el panel de administrador.
export async function getAllSubdomains() {
  const { data, error } = await supabase
    .from('Store')
    .select('slug, name, heroTitle, created_at');

  if (error) {
    console.error('Error fetching all subdomains:', error);
    return [];
  }

  // Devolvemos los datos en el formato que el panel de admin espera.
  return data.map((store: Store) => ({
    subdomain: store.slug,
    emoji: store.heroTitle || '❓',
    createdAt: new Date(store.created_at).getTime()
  }));
}
