// Reads the gallery from a OneDrive folder via Microsoft Graph (app-only auth).
// Each sub-folder of the gallery folder becomes an album; images directly inside the
// gallery folder go into a "General" album. Staff just drop photos into OneDrive.
//
// Required env vars: MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, ONEDRIVE_USER
// Optional: ONEDRIVE_GALLERY_FOLDER (default "Website Gallery")

const GRAPH = "https://graph.microsoft.com/v1.0";
const LIST_TTL_MS = 10 * 60 * 1000;
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp)$/i;
const BROWSER_MIME = /^image\/(jpeg|png|gif|webp|bmp)$/;

export interface OneDriveImage {
  id: string;
  src: string;
  full: string;
  alt: string;
  caption: string;
}

export interface OneDriveAlbum {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: OneDriveImage[];
}

interface DriveItem {
  id: string;
  name: string;
  folder?: unknown;
  file?: { mimeType?: string };
  lastModifiedDateTime?: string;
  createdDateTime?: string;
  photo?: { takenDateTime?: string };
}

let tokenCache: { token: string; expiresAt: number } | null = null;
let listCache: { albums: OneDriveAlbum[]; imageIds: Set<string>; fetchedAt: number } | null = null;
let inflight: Promise<OneDriveAlbum[]> | null = null;

export function isOneDriveConfigured(): boolean {
  return Boolean(
    process.env.MS_TENANT_ID &&
      process.env.MS_CLIENT_ID &&
      process.env.MS_CLIENT_SECRET &&
      process.env.ONEDRIVE_USER,
  );
}

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;

  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(process.env.MS_TENANT_ID!)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.MS_CLIENT_ID!,
        client_secret: process.env.MS_CLIENT_SECRET!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    },
  );
  if (!res.ok) throw new Error(`Microsoft token request failed (${res.status})`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return tokenCache.token;
}

function driveBase(): string {
  return `${GRAPH}/users/${encodeURIComponent(process.env.ONEDRIVE_USER!)}/drive`;
}

async function graphGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${await getToken()}` } });
  if (!res.ok) throw new Error(`Graph request failed (${res.status}) for ${url.split("?")[0]}`);
  return (await res.json()) as T;
}

async function listChildren(itemPath: string | null, itemId?: string): Promise<DriveItem[]> {
  const base = itemId
    ? `${driveBase()}/items/${itemId}/children`
    : `${driveBase()}/root:/${itemPath!.split("/").map(encodeURIComponent).join("/")}:/children`;
  let url: string | undefined = `${base}?$top=200&$select=id,name,folder,file,photo,createdDateTime,lastModifiedDateTime`;
  const items: DriveItem[] = [];
  while (url) {
    const page: { value: DriveItem[]; "@odata.nextLink"?: string } = await graphGet(url);
    items.push(...page.value);
    url = page["@odata.nextLink"];
  }
  return items;
}

function isImage(item: DriveItem): boolean {
  return Boolean(item.file) && (BROWSER_MIME.test(item.file?.mimeType ?? "") || IMAGE_EXT.test(item.name));
}

function itemDate(item: DriveItem): number {
  return Date.parse(item.photo?.takenDateTime || item.createdDateTime || "") || 0;
}

function prettify(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
}

function toImage(item: DriveItem, albumName: string): OneDriveImage {
  return {
    id: item.id,
    src: `/api/gallery/onedrive/image/${encodeURIComponent(item.id)}?size=large`,
    full: `/api/gallery/onedrive/image/${encodeURIComponent(item.id)}?size=full`,
    alt: albumName,
    caption: albumName,
  };
}

function buildAlbum(id: string, name: string, items: DriveItem[]): OneDriveAlbum | null {
  const images = items
    .filter(isImage)
    .sort((a, b) => itemDate(b) - itemDate(a) || a.name.localeCompare(b.name))
    .map((item) => toImage(item, name));
  if (images.length === 0) return null;
  return { id, name, description: "", coverImage: images[0].src, images };
}

async function loadAlbums(): Promise<OneDriveAlbum[]> {
  const folder = process.env.ONEDRIVE_GALLERY_FOLDER || "Website Gallery";
  const root = await listChildren(folder);
  const albums: OneDriveAlbum[] = [];

  const general = buildAlbum("general", "General", root);
  const subfolders = root.filter((i) => i.folder).sort((a, b) => a.name.localeCompare(b.name));
  const folderAlbums = await Promise.all(
    subfolders.map(async (f) => buildAlbum(`od-${f.id}`, prettify(f.name), await listChildren(null, f.id))),
  );

  for (const album of folderAlbums) if (album) albums.push(album);
  if (general) albums.push(general);

  const imageIds = new Set<string>();
  albums.forEach((a) => a.images.forEach((i) => imageIds.add(i.id)));
  listCache = { albums, imageIds, fetchedAt: Date.now() };
  return albums;
}

export async function getOneDriveAlbums(force = false): Promise<OneDriveAlbum[]> {
  if (!force && listCache && Date.now() - listCache.fetchedAt < LIST_TTL_MS) return listCache.albums;
  if (!inflight) {
    inflight = loadAlbums().finally(() => {
      inflight = null;
    });
  }
  try {
    return await inflight;
  } catch (error) {
    // Serve stale data if OneDrive is temporarily unreachable
    if (listCache) return listCache.albums;
    throw error;
  }
}

// Only items that appear in the gallery listing may be proxied, so the app-only token
// can't be used to read arbitrary files from the drive.
export async function fetchOneDriveImage(id: string, size: "large" | "full") {
  if (!/^[\w!-]+$/.test(id)) return null;
  if (!listCache?.imageIds.has(id)) await getOneDriveAlbums(true);
  if (!listCache?.imageIds.has(id)) return null;

  const path = size === "full" ? "content" : "thumbnails/0/large/content";
  const res = await fetch(`${driveBase()}/items/${id}/${path}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
    redirect: "follow",
  });
  if (!res.ok && size === "large") return fetchOneDriveImage(id, "full");
  if (!res.ok) return null;
  return {
    contentType: res.headers.get("content-type") || "image/jpeg",
    buffer: Buffer.from(await res.arrayBuffer()),
  };
}
