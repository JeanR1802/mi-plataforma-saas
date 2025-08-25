'use server';

import { supabase } from '@/lib/supabase'; // Importamos nuestro nuevo conector de Supabase
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

export async function createStoreAction( // Cambiamos el nombre para que sea más claro
  prevState: any,
  formData: FormData
) {
  const slug = formData.get('subdomain') as string;
  // El campo 'icon' del formulario ya no lo usaremos, pero lo dejamos por si acaso.
  const name = `Tienda ${slug}`; // Creamos un nombre por defecto

  if (!slug) {
    return { success: false, error: 'El nombre del subdominio es requerido' };
  }

  const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSlug !== slug) {
    return {
      slug,
      success: false,
      error: 'El subdominio solo puede tener letras minúsculas, números y guiones.'
    };
  }

  // --- LÓGICA DE SUPABASE ---
  // 1. Verificamos si el slug ya existe en nuestra tabla 'Store'
  const { data: existingStore, error: checkError } = await supabase
    .from('Store')
    .select('slug')
    .eq('slug', sanitizedSlug)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // Ignoramos el error "no rows found"
    console.error('Error al verificar slug:', checkError);
    return { success: false, error: 'Error en la base de datos.' };
  }

  if (existingStore) {
    return {
      slug,
      success: false,
      error: 'Este subdominio ya está en uso.'
    };
  }

  // 2. Si no existe, lo insertamos en la tabla 'Store'
  const { error: insertError } = await supabase.from('Store').insert({
    slug: sanitizedSlug,
    name: name,
    status: 'BUILT' // Puedes poner el estado que quieras
  });

  if (insertError) {
    console.error('Error al insertar tienda:', insertError);
    return { success: false, error: 'No se pudo crear la tienda.' };
  }
  // --- FIN LÓGICA DE SUPABASE ---

  // Redirigimos al nuevo subdominio
  redirect(`${protocol}://${sanitizedSlug}.${rootDomain}`);
}
