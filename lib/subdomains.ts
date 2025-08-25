import { redis } from '@/lib/redis';

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
    console.warn(
      'Emoji regex validation failed, using fallback validation',
      error
    );
  }

  return str.length >= 1 && str.length <= 10;
}

type SubdomainData = {
  emoji: string;
  createdAt: number;
};

export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const data = await redis.get<SubdomainData>(
    `subdomain:${sanitizedSubdomain}`
  );
  return data;
}

export async function getAllSubdomains() {
  const keys = await redis.keys('subdomain:*');

  if (!keys.length) {
    return [];
  }

  const values = await redis.mget<SubdomainData[]>(...keys);

  return keys.map((key, index) => {
    const subdomain = key.replace('subdomain:', '');
    const data = values[index];

    return {
      subdomain,
      emoji: data?.emoji || '❓',
      createdAt: data?.createdAt || Date.now()
    };
  });
}
