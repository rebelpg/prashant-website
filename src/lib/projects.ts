import type { CollectionEntry } from 'astro:content';

// A project gets its own page (and a "more" link) when it has body text, steps or a video.
export function hasPage(entry: CollectionEntry<'projects'>): boolean {
  return Boolean(entry.body?.trim()) || entry.data.steps.length > 0 || Boolean(entry.data.video);
}

// YouTube embed info for a watch, youtu.be or shorts URL; undefined for other links.
export function youtubeEmbed(href: string): { src: string; vertical: boolean } | undefined {
  let url: URL;
  try { url = new URL(href); } catch { return undefined; }
  if (!/(^|\.)(youtube\.com|youtu\.be)$/.test(url.hostname)) return undefined;
  const shorts = url.pathname.match(/^\/shorts\/([\w-]{11})/);
  const id =
    shorts?.[1] ??
    (url.hostname === 'youtu.be' ? url.pathname.slice(1, 12) : url.searchParams.get('v') ?? undefined);
  if (!id || !/^[\w-]{11}$/.test(id)) return undefined;
  return { src: `https://www.youtube-nocookie.com/embed/${id}`, vertical: Boolean(shorts) };
}
