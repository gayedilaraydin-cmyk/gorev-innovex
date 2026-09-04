import crypto from 'node:crypto';

export function slugify(name: string): string {
  return name
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Okunabilir bir öndeki (müşteri adından) tahmin edilemeyecek rastgele bir
// sonek ekler — pano linkinin kendisi tek "kimlik doğrulama" olduğu için
// bu sonek sırf kozmetik değil, gizliliğin kaynağıdır.
export function generateBoardSlug(name: string): string {
  const base = slugify(name) || 'pano';
  const secret = crypto.randomBytes(6).toString('base64url');
  return `${base}-${secret}`;
}
