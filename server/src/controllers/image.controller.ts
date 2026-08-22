import { Request, Response } from 'express';

interface CachedImage {
  body: Buffer;
  contentType: string;
}

const imageCache = new Map<string, CachedImage>();
const pendingImages = new Map<string, Promise<CachedImage | null>>();
const fallbackSvg = (city: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720"><rect width="1200" height="720" fill="#EAE3DA"/><path d="M0 540 300 300l170 130 210-220 520 330v180H0z" fill="#1B3B2B" opacity=".9"/><circle cx="930" cy="170" r="90" fill="#D46241" opacity=".85"/><text x="64" y="120" fill="#1C1C1C" font-family="Georgia,serif" font-size="48">${city.replace(/[&<>"']/g, '') || 'TripPilot'}</text></svg>`;

const sendFallback = (res: Response, city: string) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('image/svg+xml').send(fallbackSvg(city));
};

const loadImage = async (city: string, accessKey: string): Promise<CachedImage | null> => {
  const searchResponse = await fetch(`https://api.unsplash.com/search/photos?per_page=1&query=${encodeURIComponent(`${city} travel landmark`)}`, { headers: { Authorization: `Client-ID ${accessKey}` } });
  if (!searchResponse.ok) return null;
  const searchData = await searchResponse.json() as { results?: Array<{ urls?: { regular?: string } }> };
  const imageUrl = searchData.results?.[0]?.urls?.regular;
  if (!imageUrl) return null;
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) return null;
  return { body: Buffer.from(await imageResponse.arrayBuffer()), contentType: imageResponse.headers.get('content-type') || 'image/jpeg' };
};

export const getCityImage = async (req: Request, res: Response) => {
  const city = String(req.query.city || '').trim();
  if (!city) return sendFallback(res, '');

  const key = city.toLocaleLowerCase();
  const cached = imageCache.get(key);
  if (cached) {
    res.set('Cache-Control', 'public, max-age=86400');
    res.type(cached.contentType).send(cached.body);
    return;
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return sendFallback(res, city);

  try {
    let pending = pendingImages.get(key);
    if (!pending) {
      pending = loadImage(city, accessKey).finally(() => pendingImages.delete(key));
      pendingImages.set(key, pending);
    }
    const image = await pending;
    if (!image) return sendFallback(res, city);
    imageCache.set(key, image);
    res.set('Cache-Control', 'public, max-age=86400');
    res.type(image.contentType).send(image.body);
  } catch (error) {
    console.error('City image lookup error:', error);
    sendFallback(res, city);
  }
};