'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';
import { isValidIcon } from '@/lib/subdomains';

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;

  if (!subdomain || !icon) {
    return { success: false, error: 'Subdomain and icon are required' };
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)'
    };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  const { data: existingStore, error: checkError } = await supabase
    .from('Store')
    .select('slug')
    .eq('slug', sanitizedSubdomain)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error al verificar slug:', checkError);
    return { success: false, error: 'Error en la base de datos.' };
  }

  if (existingStore) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'This subdomain is already taken'
    };
  }

  const { error: insertError } = await supabase.from('Store').insert({
    slug: sanitizedSubdomain,
    name: `Tienda ${sanitizedSubdomain}`,
    heroTitle: icon,
    status: 'BUILT'
  });

  if (insertError) {
    console.error('Error al insertar tienda:', insertError);
    return { success: false, error: 'No se pudo crear la tienda.' };
  }

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  
  const { error } = await supabase
    .from('Store')
    .delete()
    .eq('slug', subdomain);

  if (error) {
    console.error('Error al borrar tienda:', error);
    return { error: 'No se pudo borrar el subdominio.' };
  }

  revalidatePath('/admin');
  return { success: 'Subdominio borrado con éxito.' };
}
