/**
 * Pure date utility helpers for Indian Standard Time (IST = UTC+05:30).
 * IST is fixed year-round with zero daylight saving time (DST).
 * Implemented using standard JavaScript Date (no extra npm dependencies).
 */

/**
 * Convert an IST datetime-local input string (YYYY-MM-DDTHH:mm) to a UTC ISO string.
 */
export function istInputToUtcIso(istString?: string | null): string | null {
  if (!istString || !istString.trim()) return null;
  const trimmed = istString.trim();

  // If already a valid full ISO string, standardize it
  if (trimmed.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  const withSeconds = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  const date = new Date(`${withSeconds}+05:30`);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Convert a UTC ISO string from the database to an IST string suitable for <input type="datetime-local"> (YYYY-MM-DDTHH:mm).
 */
export function utcIsoToIstInput(utcIsoString?: string | null): string {
  if (!utcIsoString) return "";
  const date = new Date(utcIsoString);
  if (isNaN(date.getTime())) return "";

  // Shift UTC time by +5 hours and 30 minutes
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const istDate = new Date(istMs);

  const pad = (n: number) => String(n).padStart(2, "0");
  const year = istDate.getUTCFullYear();
  const month = pad(istDate.getUTCMonth() + 1);
  const day = pad(istDate.getUTCDate());
  const hours = pad(istDate.getUTCHours());
  const minutes = pad(istDate.getUTCMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Returns current IST timestamp formatted for <input type="datetime-local"> (YYYY-MM-DDTHH:mm).
 */
export function getNowIstInput(): string {
  return utcIsoToIstInput(new Date().toISOString());
}

/**
 * Format a UTC ISO timestamp for administrative display in IST (e.g. "15 Nov 2026, 02:30 PM IST").
 */
export function formatUtcToIst(utcIsoString?: string | null): string {
  if (!utcIsoString) return "Indefinite";
  const date = new Date(utcIsoString);
  if (isNaN(date.getTime())) return "Invalid date";

  return `${date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  })} IST`;
}
