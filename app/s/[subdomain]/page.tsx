import { getSubdomainData } from '@/lib/subdomains';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { rootDomain } from '@/lib/utils';

// Definimos un tipo para las props que reciben nuestras funciones
type Props = {
  params: { subdomain: string };
};

// Esta función genera los metadatos (título de la pestaña) dinámicamente
export async function generateMetadata({
  params
}: Props): Promise<Metadata | null> {
  const data = await getSubdomainData(params.subdomain);
  if (!data) {
    return null;
  }
  const { subdomain } = data;
  return {
    title: `${subdomain} | ${rootDomain}`
  };
}

// Esta es la página principal del subdominio
export default async function SubdomainPage({
  params
}: Props) {
  const data = await getSubdomainData(params.subdomain);

  // Si no encuentra la tienda en Supabase, muestra un 404
  if (!data) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        {/* Usamos el 'emoji' que guardamos en la columna 'heroTitle' de Supabase */}
        <h1 className="text-9xl">{data.emoji}</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Bienvenido a {data.subdomain}.{rootDomain}
        </p>
      </div>
    </div>
  );
}
