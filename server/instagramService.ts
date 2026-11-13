// Fetches the church's latest Instagram photos. The account must be a Business or Creator account.
//
// Required env var: IG_ACCESS_TOKEN. Optional: IG_MEDIA_LIMIT (default 24).
// Two token types are supported:
//  - "IG..." tokens (Instagram API with Instagram Login). Long-lived tokens expire after 60 days
//    unless refreshed; we refresh once a day while running.
//  - "EAA..." tokens (Instagram API with Facebook Login, including system-user tokens). The
//    Instagram account ID comes from IG_USER_ID, or is discovered from the token's Facebook Pages.
//    These are not refreshed here.

const GRAPH = "https://graph.instagram.com";
const FACEBOOK_GRAPH = "https://graph.facebook.com/v21.0";
const CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_PHOTOS = 20;
const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

export interface InstagramImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
  permalink: string;
}

interface MediaItem {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink: string;
  timestamp: string;
  children?: { data: { media_type: "IMAGE" | "VIDEO"; media_url?: string }[] };
}

let cache: { images: InstagramImage[]; fetchedAt: number } | null = null;
let refreshTimer: NodeJS.Timeout | null = null;
let discoveredUserId: string | null = null;

function getToken(): string {
  return (process.env.IG_ACCESS_TOKEN ?? "").trim();
}

function usesFacebookLogin(): boolean {
  return getToken().startsWith("EAA");
}

export function isInstagramConfigured(): boolean {
  return Boolean(getToken());
}

async function graphGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } } & T;
  if (!res.ok) {
    throw new Error(`Instagram request failed (${res.status}): ${body.error?.message ?? "no details"}`);
  }
  return body;
}

async function getFacebookLoginUserId(): Promise<string> {
  const configured = process.env.IG_USER_ID?.trim();
  if (configured) return configured;
  if (discoveredUserId) return discoveredUserId;

  const token = encodeURIComponent(getToken());
  const pages = await graphGet<{ data: { instagram_business_account?: { id: string } }[] }>(
    `${FACEBOOK_GRAPH}/me/accounts?fields=instagram_business_account&access_token=${token}`,
  );
  const id = pages.data.find((page) => page.instagram_business_account)?.instagram_business_account?.id;
  if (!id) {
    throw new Error("No Instagram account found for this token. Set IG_USER_ID to the Instagram account ID.");
  }
  discoveredUserId = id;
  return id;
}

function shorten(text: string, max = 140): string {
  const firstLine = text.split("\n")[0].trim();
  return firstLine.length > max ? `${firstLine.slice(0, max - 1)}…` : firstLine;
}

export async function getInstagramImages(): Promise<InstagramImage[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.images;

  const limit = Math.min(Math.max(Number(process.env.IG_MEDIA_LIMIT) || 24, 1), 50);

  try {
    const base = usesFacebookLogin() ? `${FACEBOOK_GRAPH}/${await getFacebookLoginUserId()}` : `${GRAPH}/me`;
    const json = await graphGet<{ data: MediaItem[] }>(
      `${base}/media?fields=id,caption,media_type,media_url,permalink,timestamp,children{media_type,media_url}&limit=${limit}` +
        `&access_token=${encodeURIComponent(getToken())}`,
    );

    // Photos only: skip videos, and for carousels keep just the image slides
    const photos = json.data.flatMap((m) => {
      if (m.media_type === "IMAGE") return m.media_url ? [{ post: m, url: m.media_url }] : [];
      if (m.media_type === "CAROUSEL_ALBUM") {
        return (m.children?.data ?? [])
          .filter((c) => c.media_type === "IMAGE" && c.media_url)
          .map((c) => ({ post: m, url: c.media_url! }));
      }
      return [];
    });

    const images = photos.slice(0, MAX_PHOTOS).map(({ post, url }, i) => ({
      id: 900000 + i,
      src: url,
      alt: post.caption ? shorten(post.caption) : "Kingsborough Church on Instagram",
      caption: post.caption ? shorten(post.caption) : "From our Instagram",
      permalink: post.permalink,
    }));

    cache = { images, fetchedAt: Date.now() };
    return images;
  } catch (error) {
    // Serve stale data if Instagram is temporarily unreachable
    if (cache) return cache.images;
    throw error;
  }
}

async function refreshToken(): Promise<void> {
  try {
    const res = await fetch(
      `${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(getToken())}`,
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    console.log("Instagram access token refreshed");
  } catch (error) {
    console.error("Instagram token refresh failed:", error instanceof Error ? error.message : error);
  }
}

export function startInstagramTokenRefresh(): void {
  if (!isInstagramConfigured() || usesFacebookLogin() || refreshTimer) return;
  void refreshToken();
  refreshTimer = setInterval(() => void refreshToken(), REFRESH_INTERVAL_MS);
  refreshTimer.unref();
}
