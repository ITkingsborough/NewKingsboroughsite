// Fetches church events from a public Google Sheet and filters them to the current week.
// Sheet must have "General access" set to "Anyone with the link" (Viewer) to be readable.
const SPREADSHEET_ID = "15UAozSVgxy2RKcQIdNoWGcMEotI32AN3VqXg84chbqM";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;

export interface SheetEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  image: string | null;
  featured: boolean;
}

// Simple RFC4180-ish CSV parser (handles quoted fields, escaped quotes, commas/newlines inside quotes)
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && next === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
  }
  // Trailing field/row
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z]/g, "");
}

// Accepts YYYY-MM-DD or DD/MM/YYYY, returns YYYY-MM-DD or null if unparseable
function normalizeDate(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const dmyMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return null;
}

// Converts a Google Drive "share" link into our own image-proxy URL.
// Browsers block direct <img> requests to drive.google.com/googleusercontent.com thumbnails
// with ERR_BLOCKED_BY_ORB, so we route them through our own server instead.
function toDirectImageUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return value;

  const driveMatch = value.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
  if (driveMatch) {
    return `/api/events/image-proxy/${driveMatch[1]}`;
  }

  return value;
}

function rowsToEvents(rows: string[][]): SheetEvent[] {
  // Some sheets have a title row above the real header row (e.g. "WEBSITE EVENTS").
  // Find the first row that normalizes to include a "date" column and treat it as the header row.
  const headerRowIndex = rows.findIndex((r) => r.map(normalizeHeader).includes("date"));
  if (headerRowIndex === -1 || rows.length < headerRowIndex + 2) return [];

  const headers = rows[headerRowIndex].map(normalizeHeader);
  const dataRows = rows.slice(headerRowIndex + 1);
  const colIndex = (...names: string[]) => {
    for (const name of names) {
      const idx = headers.indexOf(name);
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const titleCol = colIndex("event", "events", "eventname", "title", "name");
  const dateCol = colIndex("date");
  const timeCol = colIndex("time");
  const locationCol = colIndex("venue", "location");
  const imageCol = colIndex("image", "imageurl", "photo");
  const descriptionCol = colIndex("description", "desc");
  const featuredCol = colIndex("featured");

  const events: SheetEvent[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const title = titleCol !== -1 ? row[titleCol]?.trim() : "";
    const rawDate = dateCol !== -1 ? row[dateCol]?.trim() : "";
    if (!title || !rawDate) continue;

    const date = normalizeDate(rawDate);
    if (!date) continue;

    const image = imageCol !== -1 ? row[imageCol]?.trim() : "";
    const featuredRaw = featuredCol !== -1 ? row[featuredCol]?.trim().toLowerCase() : "";

    events.push({
      id: `sheet-${i}`,
      title,
      date,
      time: (timeCol !== -1 ? row[timeCol]?.trim() : "") || "",
      location: (locationCol !== -1 ? row[locationCol]?.trim() : "") || "",
      description: (descriptionCol !== -1 ? row[descriptionCol]?.trim() : "") || "",
      image: image ? toDirectImageUrl(image) : null,
      featured: featuredRaw === "true" || featuredRaw === "yes",
    });
  }

  return events;
}

let cache: { data: SheetEvent[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchSheetEvents(): Promise<SheetEvent[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const response = await fetch(CSV_URL);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || contentType.includes("text/html")) {
    throw new Error(
      "Could not read the events Google Sheet. Make sure its General access is set to 'Anyone with the link' (Viewer)."
    );
  }

  const csvText = await response.text();
  const events = rowsToEvents(parseCsv(csvText));

  cache = { data: events, fetchedAt: Date.now() };
  return events;
}

// Monday 00:00 -> Sunday 23:59:59 of the current week, based on server local time
function getCurrentWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export async function getCurrentWeekEvents(): Promise<SheetEvent[]> {
  const events = await fetchSheetEvents();
  const { start, end } = getCurrentWeekRange();

  return events
    .filter((event) => {
      const eventDate = new Date(`${event.date}T00:00:00`);
      return eventDate >= start && eventDate <= end;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
