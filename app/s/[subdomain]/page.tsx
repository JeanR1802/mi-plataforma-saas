import { getSubdomainData } from '@/lib/subdomains';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { rootDomain } from '@/lib/utils';

export async function generateMetadata({
  params
}: {
  params: { subdomain: string };
}): Promise<Metadata | null> {
  const data = await getSubdomainData(params.subdomain);
  if (!data) {
    return null;
  }
  const { subdomain } = params;
  return {
    title: `${subdomain} | ${rootDomain}`
  };
}

export default async function SubdomainPage({
  params
}: {
  params: { subdomain: string };
}) {
  const data = await getSubdomainData(params.subdomain);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <h1 className="text-9xl">{data.emoji}</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Welcome to {params.subdomain}.{rootDomain}
        </p>
      </div>
    </div>
  );
}
