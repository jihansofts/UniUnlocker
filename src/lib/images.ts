/** Hosts next/image may optimize. Keep in sync with next.config.ts. */
export const ALLOWED_IMAGE_HOSTS = ["images.pexels.com", "res.cloudinary.com"];

export const FALLBACK_IMAGE = "/images/fallback.svg";

export function isAllowedImageUrl(value: string): boolean {
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

export function pexelsUrl(id: number, width = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}
